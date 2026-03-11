import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { createUser, findUserByEmail } from "../repositories/userRepository"
import { userModel } from "../models/userModel"
import { configDotenv } from "dotenv"

configDotenv()

const SALT_ROUNDS = 10
const JWT_SECRET = process.env.JWT_SECRET as string

export const registerUser = async (data: userModel) => {

  const existingUser = await findUserByEmail(data.email)

  if (existingUser) {
    throw new Error("Email already exists")
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

  data.password = hashedPassword
  data.role = data.role ?? "user"

  const user = await createUser(data)

  return user
}

export const loginUser = async (email: string, password: string) => {

  const user = await findUserByEmail(email)

  if (!user) {
    throw new Error("Invalid email")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error("Invalid password")
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  )

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  }
}