import { IdentityPayload, BankPayload, LoanRequestPayload, ConsentPayload } from "../models/loanModel"
import { encrypt } from "../utlis/encryption"
import { getBankName } from "../utlis/bankLookup"
import { saveIdentityDetails, saveBankDetails, saveLoanRequest, saveConsentDetails } from "../repositories/laonRepository"

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

  const bankName = await getBankName(data.routingNumber)

  const result = await saveBankDetails(
    data.applicationId,
    data.accountNumber,
    data.routingNumber,
    bankName
  )

  if (!result) {
    throw new Error(`Application with id ${data.applicationId} not found`)
  }

  return {
    applicationId: result.id,
    bankName
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