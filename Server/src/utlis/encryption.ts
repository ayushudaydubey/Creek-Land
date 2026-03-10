import crypto from "crypto"

const algorithm = "aes-256-cbc"

const secret = process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_SECRET
if (!secret) {
  throw new Error("ENCRYPTION_KEY (or ENCRYPTION_SECRET) is not set in environment")
}

const key = crypto.createHash("sha256").update(String(secret)).digest()

const iv = Buffer.alloc(16, 0)

export const encrypt = (text: string): string => {

  const cipher = crypto.createCipheriv(algorithm, key, iv)

  let encrypted = cipher.update(text, "utf8", "hex")

  encrypted += cipher.final("hex")

  return encrypted
}