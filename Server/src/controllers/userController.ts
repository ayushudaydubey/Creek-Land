import { Request, Response } from "express"
import { registerUser } from "../services/userService"
import { userSchema } from "../validations/userValidation"

export const registerUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = userSchema.parse(req.body)

    const user = await registerUser(validatedData)

    res.status(201).json({
      message: "User registered successfully",
      data: user
    })
  } catch (error) {
    res.status(400).json({
      message: "Invalid data",
      error
    })
  }
}