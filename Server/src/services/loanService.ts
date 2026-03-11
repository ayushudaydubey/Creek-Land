import { IdentityPayload, BankPayload } from "../models/loanModel"
import { encrypt } from "../utlis/encryption"
import { getBankName } from "../utlis/bankLookup"
import { saveIdentityDetails, saveBankDetails } from "../repositories/laonRepository"

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