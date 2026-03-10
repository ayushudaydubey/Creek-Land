
import { db } from "../config/db"
import { IdentityPayload } from "../models/loanModel"

export const saveIdentityDetails = async (data: IdentityPayload) => {

  const query = `
  UPDATE loan_applications
  SET 
    ssn = $1,
    driver_license = $2,
    dl_state = $3
  WHERE id = $4
  RETURNING id
  `

  const values = [
    data.ssn,
    data.driverLicense,
    data.state,
    data.applicationId
  ]

  const result = await db.query(query, values)

  return result.rows[0]

}