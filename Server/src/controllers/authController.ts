import { Request, Response } from "express"
import { generateToken } from "../services/authService"

export const login = async (req: Request, res: Response) => {
  const token = generateToken({ id: 1 })

  res.json({ token })
}