import { z } from "zod"

export const userSchema = z.object({
  full_name: z.string().min(2),
  dob: z.string().refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), { message: 'dob must be in YYYY-MM-DD format' }),
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string()
})

export const userRegisterSchema = userSchema.extend({
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).optional()
})