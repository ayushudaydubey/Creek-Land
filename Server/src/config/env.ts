import dotenv from "dotenv"

dotenv.config()

export const env = {
  PORT: process.env.PORT || 9000,
  DB_URL: process.env.DB_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY!
}