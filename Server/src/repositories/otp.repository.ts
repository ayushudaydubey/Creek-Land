import { client } from "../config/twilio"

const getVerifyServiceSid = (): string => {
  const sid = process.env.TWILIO_VERIFY_SERVICE_SID
  if (!sid) {
    throw new Error("TWILIO_VERIFY_SERVICE_SID is not set in environment")
  }
  return sid
}

export const sendOTPRepo = async (phone: string) => {
  const serviceSid = getVerifyServiceSid()
  return await client.verify.v2
    .services(serviceSid)
    .verifications.create({
      to: phone,
      channel: "sms"
    })
}

export const verifyOTPRepo = async (phone: string, code: string) => {
  const serviceSid = getVerifyServiceSid()
  return await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({
      to: phone,
      code: code
    })
}