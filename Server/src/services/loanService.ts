import { IdentityPayload, BankPayload, LoanRequestPayload, ConsentPayload, SubmitApplicationPayload } from "../models/loanModel"
import { encrypt } from "../utlis/encryption"
import { getBankName } from "../utlis/bankLookup"
import { saveIdentityDetails, saveBankDetails, saveLoanRequest, saveConsentDetails, submitLoanApplication, createLoanApplication } from "../repositories/laonRepository"
import { validateBankPayload, ValidationError } from "../validations/bankValidation"

export const saveIdentity = async (data: IdentityPayload) => {

  const encryptedSSN = encrypt(data.ssn)

  const encryptedDL = encrypt(data.driverLicense)

  const payload: IdentityPayload = {
    applicationId: data.applicationId,
    ssn: encryptedSSN,
    driverLicense: encryptedDL,
    state: data.state
  }

  return await saveIdentityDetails(payload)

}

export const saveBank = async (data: BankPayload) => {
  // Validate payload based on country
  let validated
  try {
    validated = validateBankPayload({
      accountNumber: data.accountNumber,
      routingNumber: data.routingNumber,
      ifscCode: data.ifscCode,
      country: data.country,
      bankName: data.bankName || null
    })
  } catch (err) {
    if (err instanceof ValidationError) throw err
    throw new Error('Invalid bank payload')
  }

  // Perform bank lookup only for routing numbers (US/CA)
  let lookupName: string | null = null
  if (validated.routingNumber) {
    try {
      lookupName = await getBankName(validated.routingNumber)
    } catch (err) {
      lookupName = null
    }
  }

  // prefer provided bankName (eg. India) otherwise use lookup
  const finalBankName = (validated as any).bankName || lookupName || null

  // Persist bank details. Encryption and masking handled in repository.
  const result = await saveBankDetails(
    data.applicationId,
    validated.accountNumber,
    validated.routingNumber,
    validated.ifscCode,
    validated.country,
    finalBankName
  )

  if (!result) {
    throw new Error(`Application with id ${data.applicationId} not found`)
  }

  return {
    applicationId: result.id,
    bankName: finalBankName,
    country: result.country
  }

}



export const saveLoan = async (data: LoanRequestPayload) => {

  const result = await saveLoanRequest(
    data.applicationId,
    data.loanAmount,
    data.loanPurpose
  )

  return {
    applicationId: result.id,
    loanAmount: data.loanAmount,
    loanPurpose: data.loanPurpose
  }

}


export const saveConsent = async (data: ConsentPayload) => {

  const result = await saveConsentDetails(
    data.applicationId,
    data.smsConsent,
    data.callConsent,
    data.emailConsent,
    data.jornayaLeadId,
    data.trustedFormCertUrl
  )

  return {
    applicationId: result.id,
    consentSaved: true
  }

}



export const submitLoan = async (data: SubmitApplicationPayload) => {

  const result = await submitLoanApplication(
    data.applicationId,
    data.utmSource,
    data.utmMedium,
    data.utmCampaign,
    data.ipAddress
  )

  return {
    applicationId: result.id,
    status: result.status
  }

}

export const createApplication = async (country?: string | null) => {
  return await createLoanApplication(country)
}