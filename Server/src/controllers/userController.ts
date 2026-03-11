import { Request, Response } from "express"
import { registerUser, loginUser } from "../services/userService"
import { userSchema, userRegisterSchema } from "../validations/userValidation"

export const registerUserController = async (
  req: Request,
  res: Response
) => {
  try {

    const validatedData = userRegisterSchema.parse(req.body)

    const user = await registerUser(validatedData)

    res.status(201).json({
      message: "User registered successfully",
      data: user
    })

  } catch (error:any) {

    res.status(400).json({
      message: error.message
    })
  }
}

export const loginUserController = async (
  req: Request,
  res: Response
) => {
  try {

    const { email, password } = req.body

    const result = await loginUser(email, password)

    res.json({
      message: "Login successful",
      data: result
    })

  } catch (error:any) {

    res.status(400).json({
      message: error.message
    })
  }
}