import { client } from "../config/twilio"

const getVerifyServiceSid = (): string => {
  const sid = process.env.TWILIO_VERIFY_SERVICE_SID
  if (!sid) {
    throw new Error("TWILIO_VERIFY_SERVICE_SID is not set in environment")
  }
  return sid
}

export const sendOTPRepo = async (phone: string) => {
  // Allow a simple local mock for development: set TWILIO_MOCK=true in Server/.env
  if (process.env.TWILIO_MOCK === "true") {
    return {
      sid: "MOCK_SID",
      to: phone,
      status: "pending"
    }
  }

  const serviceSid = getVerifyServiceSid()
  try {
    const resp = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: phone,
        channel: "sms"
      })

    console.log("Twilio verification created:", resp)
    return resp
  } catch (err: any) {
    // surface Twilio error message with extra context
    const msg = err?.message || JSON.stringify(err)
    const code = err?.code
    const more = err?.moreInfo
    console.error('Twilio sendOTP error', { code, message: msg, moreInfo: more, err })
    throw new Error(`Twilio sendOTP failed: ${msg}`)
  }
}

export const verifyOTPRepo = async (phone: string, code: string, verificationSid?: string) => {
  // If mocking, return approved for any code === '000000' (dev shortcut), otherwise fake
  if (process.env.TWILIO_MOCK === "true") {
    return {
      sid: "MOCK_VERIFY",
      to: phone,
      status: "approved"
    }
  }

  const serviceSid = getVerifyServiceSid()
  try {
    let resp
    if (verificationSid) {
      // Use verification SID returned by sendOTP to target the exact verification
      resp = await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({
          verificationSid: verificationSid,
          code: code
        })
    } else {
      resp = await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({
          to: phone,
          code: code
        })
    }

    console.log("Twilio verification check:", resp)
    return resp
  } catch (err: any) {
    const msg = err?.message || JSON.stringify(err)
    const code = err?.code
    const more = err?.moreInfo
    console.error('Twilio verifyOTP error', { code, message: msg, moreInfo: more, err })

    // Twilio returns 20404 for resource not found — provide a clearer message
    if (code === 20404) {
      throw new Error('Twilio verifyOTP failed: Verification resource not found. Ensure the Verify Service SID is correct and that a verification was recently created for this phone number.')
    }

    throw new Error(`Twilio verifyOTP failed: ${msg}`)
  }
}