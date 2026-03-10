import { IdentityPayload } from "../models/loanModel"
import { encrypt } from "../utlis/encryption"
import { saveIdentityDetails } from "../repositories/laonRepository"

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