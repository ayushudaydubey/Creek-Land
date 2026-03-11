import { db } from "../config/db"
import { userModel } from "../models/userModel"

export const createUser = async (data: userModel) => {
  const query = `
    INSERT INTO users
    (full_name, dob, phone, email, address, city, state, zip, password, role)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING id, full_name, email, role
  `

  const values = [
    data.full_name,
    data.dob,
    data.phone,
    data.email,
    data.address,
    data.city,
    data.state,
    data.zip,
    data.password,
    data.role || "user"
  ]

  const result = await db.query(query, values)

  return result.rows[0]
}

export const findUserByEmail = async (email: string) => {
  const query = `SELECT * FROM users WHERE email=$1`
  const result = await db.query(query, [email])

  return result.rows[0]
}