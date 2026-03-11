import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET as string

export const authMiddleware = (req: any, res: any, next: any) => {

  let token

  // 1️ Check cookie
  if (req.cookies?.token) {
    token = req.cookies.token
  }

  // 2️ Check header
  else if (req.headers.authorization) {
    const parts = req.headers.authorization.split(" ")
    token = parts.length === 2 ? parts[1] : parts[0]
  }

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    })
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET)

    req.user = decoded

    next()

  } catch {

    res.status(401).json({
      message: "Invalid token"
    })
  }
}