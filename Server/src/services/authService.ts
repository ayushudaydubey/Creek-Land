import jwt from "jsonwebtoken"
import { env } from "../config/env"

export const generateToken = (user: any) => {
  return jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: "1d"
  })
}