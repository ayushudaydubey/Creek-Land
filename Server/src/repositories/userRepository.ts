import { db } from "../config/db"
import { userModel } from "../models/userModel"

export const createUser = async (data: userModel) => {
  const query = `
    INSERT INTO users
    (full_name, dob, phone, email, address, city, state, zip)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `

  const values = [
    data.full_name,
    data.dob,
    data.phone,
    data.email,
    data.address,
    data.city,
    data.state,
    data.zip
  ]

  const result = await db.query(query, values)

  return result.rows[0]
}