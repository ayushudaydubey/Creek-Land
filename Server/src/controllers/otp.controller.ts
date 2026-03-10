import { Request, Response } from "express"
import { sendOTPService, verifyOTPService } from "../services/otp-service"

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body

    const result = await sendOTPService(phone)

    res.json({
      message: "OTP sent",
      data: result
    })
  } catch (error) {
    console.error("sendOTP error:", error)
    res.status(500).json({ error: error instanceof Error ? error.message : error })
  }
}

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body

    const result = await verifyOTPService(phone, code)

    res.json({
      message: "OTP verified",
      data: result
    })
  } catch (error) {
    console.error("verifyOTP error:", error)
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid OTP" })
  }
}