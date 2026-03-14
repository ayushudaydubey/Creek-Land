import { db } from "../config/db";
import { encrypt } from "../utlis/encryption"
import { IdentityPayload } from "../models/loanModel";

// export const saveBankDetails = async (
//   applicationId: number,
//   accountNumber: string,
//   routingNumber: string,
//   bankName: string
// ) => {

//   const query = `
//   UPDATE loan_applications
//   SET
//     bank_account = $1,


export const saveBankDetails = async (
  applicationId: number,
  accountNumber: string,
  routingNumber: string | null,
  ifscCode: string | null,
  country: string,
  bankName: string | null
): Promise<any | null> => {

  // Prepare masked/plain values and encrypted blobs
  const maskedAccount = (accountNumber && accountNumber.length > 8) ? `****${accountNumber.slice(-4)}` : accountNumber

  // Encrypt sensitive values for storage in _encrypted columns
  const encryptedAccount = accountNumber ? encrypt(accountNumber) : null
  const encryptedRouting = routingNumber ? encrypt(routingNumber) : null
  const encryptedIfsc = ifscCode ? encrypt(ifscCode) : null

  // Determine which encrypted columns exist in the table
  const colsRes = await db.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name='loan_applications' AND column_name IN ('bank_account_encrypted','routing_number_encrypted','ifsc_code_encrypted')`
  )
  const cols = colsRes.rows.map((r:any) => r.column_name)

  // Build query dynamically to avoid storing invalid combinations
  const setClauses: string[] = []
  const values: any[] = []
  let idx = 1

  // store masked account in short varchar column
  setClauses.push(`bank_account = $${idx++}`)
  values.push(maskedAccount)

  // if encrypted column exists, store encrypted blob there
  if (cols.includes('bank_account_encrypted') && encryptedAccount) {
    setClauses.push(`bank_account_encrypted = $${idx++}`)
    values.push(encryptedAccount)
  }

  // country
  setClauses.push(`country = $${idx++}`)
  values.push(country)

  // routing vs ifsc — store masked in short column and encrypted to _encrypted column if present
  if (routingNumber) {
    const maskedRouting = routingNumber.length > 6 ? `****${routingNumber.slice(-4)}` : routingNumber
    setClauses.push(`routing_number = $${idx++}`)
    values.push(maskedRouting)
    if (cols.includes('routing_number_encrypted') && encryptedRouting) {
      setClauses.push(`routing_number_encrypted = $${idx++}`)
      values.push(encryptedRouting)
    }
    // ensure ifsc cleared
    setClauses.push(`ifsc_code = NULL`)
  } else if (ifscCode) {
    const maskedIfsc = ifscCode.length > 6 ? `****${ifscCode.slice(-4)}` : ifscCode
    setClauses.push(`ifsc_code = $${idx++}`)
    values.push(maskedIfsc)
    if (cols.includes('ifsc_code_encrypted') && encryptedIfsc) {
      setClauses.push(`ifsc_code_encrypted = $${idx++}`)
      values.push(encryptedIfsc)
    }
    // ensure routing cleared
    setClauses.push(`routing_number = NULL`)
  } else {
    // neither present — explicit nulls
    setClauses.push(`routing_number = NULL`)
    setClauses.push(`ifsc_code = NULL`)
  }

  // bank name
  setClauses.push(`bank_name = $${idx++}`)
  values.push(bankName)

  // updated_at
  setClauses.push(`updated_at = CURRENT_TIMESTAMP`)

  const query = `
  UPDATE loan_applications
  SET
    ${setClauses.join(',\n    ')}
  WHERE id = $${idx}
  RETURNING *
  `;

  values.push(applicationId)

  const result = await db.query(query, values);

  return result.rows[0] || null;

};

export const createLoanApplication = async (country?: string | null) => {
  const result = await db.query(`
    INSERT INTO loan_applications
      (status, country, created_at, updated_at)
    VALUES ('pending', $1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *
  `, [country || null])

  return result.rows[0]
}
export const saveIdentityDetails = async (
  data: IdentityPayload
): Promise<any> => {
  // Save identity details directly on the loan_applications row so
  // admin queries that select from loan_applications will see them.
  const query = `
  UPDATE loan_applications
  SET
    ssn = $2,
    driver_license = $3,
    dl_state = $4,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $1
  RETURNING *
  `;

  const values = [
    data.applicationId,
    data.ssn,
    data.driverLicense,
    data.state
  ];

  const result = await db.query(query, values);

  if (result.rows.length === 0) {
    throw new Error(`Application with id ${data.applicationId} not found`)
  }

  return result.rows[0];
};



export const saveLoanRequest = async (
  applicationId: number,
  
  loanAmount: number,
  loanPurpose: string
) => {

  const query = `
  UPDATE loan_applications
  SET
    loan_amount = $1,
    loan_purpose = $2
  WHERE id = $3
  RETURNING *
  `

  const values = [
    loanAmount,
    loanPurpose,
    applicationId
  ]

  const result = await db.query(query, values)

  if (result.rows.length === 0) {
    throw new Error(`Application with id ${applicationId} not found`)
  }

  return result.rows[0]

}


export const saveConsentDetails = async (
  applicationId: number,
  smsConsent: boolean,
  callConsent: boolean,
  emailConsent: boolean,
  jornayaLeadId?: string,
  trustedFormCertUrl?: string
) => {

  const query = `
  UPDATE loan_applications
  SET
    sms_consent = $1,
    call_consent = $2,
    email_consent = $3,
    jornaya_lead_id = $4,
    trustedform_cert_url = $5
  WHERE id = $6
  RETURNING *
  `

  const values = [
    smsConsent,
    callConsent,
    emailConsent,
    jornayaLeadId || null,
    trustedFormCertUrl || null,
    applicationId
  ]

  const result = await db.query(query, values)

  if (result.rows.length === 0) {
    throw new Error(`Application with id ${applicationId} not found`)
  }

  return result.rows[0]

}


export const submitLoanApplication = async (
  applicationId: number,
  utmSource?: string,
  utmMedium?: string,
  utmCampaign?: string,
  ipAddress?: string
) => {

  const query = `
  UPDATE loan_applications
  SET
    utm_source = $1,
    utm_medium = $2,
    utm_campaign = $3,
    ip_address = $4,
    status = 'pending',
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $5
  RETURNING *
  `

  const values = [
    utmSource || null,
    utmMedium || null,
    utmCampaign || null,
    ipAddress || null,
    applicationId
  ]

  const result = await db.query(query, values)

  if (result.rows.length === 0) {
    throw new Error(`Application with id ${applicationId} not found`)
  }

  return result.rows[0]

}