import { db } from "../config/db"

export const getAllApplications = async () => {

  const result = await db.query(
    `SELECT * FROM loan_applications ORDER BY created_at DESC`
  )

  return result.rows
}

export const getApplicationById = async (id:number) => {

  const result = await db.query(
    `SELECT * FROM loan_applications WHERE id=$1`,
    [id]
  )

  return result.rows[0]
}

export const updateApplicationStatus = async (
  id:number,
  status:string
) => {

  const result = await db.query(
    `UPDATE loan_applications
     SET status=$1
     WHERE id=$2
     RETURNING *`,
    [status,id]
  )

  return result.rows[0]
}