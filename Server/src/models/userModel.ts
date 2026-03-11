export interface userModel {
  id?: number
  full_name: string
  dob: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  password: string
  role?: "user" | "admin" | undefined
}