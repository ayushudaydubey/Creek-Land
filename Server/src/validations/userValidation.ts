import { z } from "zod"

export const userSchema = z.object({
  full_name: z.string().min(2),
  dob: z.string(),
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string()
})