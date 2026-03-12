import { db } from "../config/db";
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
  routingNumber: string,
  bankName: string | null
): Promise<{ id: number } | null> => {

  const query = `
  UPDATE loan_applications
  SET
    bank_account = $1,
    routing_number = $2,
    bank_name = $3
  WHERE id = $4
  RETURNING id
  `;

  const values = [
    accountNumber,
    routingNumber,
    bankName,
    applicationId
  ];

  const result = await db.query(query, values);

  return result.rows[0] || null;

};

export const createLoanApplication = async (): Promise<{ id: number }> => {
  const query = `
  INSERT INTO loan_applications
  (status, created_at, updated_at)
  VALUES ('pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  RETURNING id
  `

  const result = await db.query(query)

  return result.rows[0]

}

export const saveIdentityDetails = async (
  data: IdentityPayload
): Promise<{ id: number }> => {

  const query = `
  INSERT INTO identity_details
  (application_id, ssn, driver_license, dl_state)
  VALUES ($1, $2, $3, $4)
  RETURNING id
  `;

  const values = [
    data.applicationId,
    data.ssn,
    data.driverLicense,
    data.state
  ];

  const result = await db.query(query, values);

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
  RETURNING id
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
  RETURNING id
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
  RETURNING id, status
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