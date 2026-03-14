import { sendOTPRepo, verifyOTPRepo } from "../repositories/otp.repository"

export const sendOTPService = async (phone: string) => {
  const response = await sendOTPRepo(phone)
  return response
}

export const verifyOTPService = async (phone: string, code: string, verificationSid?: string) => {
  const response = await verifyOTPRepo(phone, code, verificationSid)

  if (response.status !== "approved") {
    throw new Error("Invalid OTP")
  }

  return response
}