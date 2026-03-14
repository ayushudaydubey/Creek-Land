import { db } from "../config/db"
import { decrypt } from "../utlis/encryption"

const safeDecrypt = (val:any) => {
  try {

    if (!val) return null

    if (typeof val !== "string") return val

    // agar encrypted hex string ho tabhi decrypt karo
    if (/^[0-9a-fA-F]{32,}$/.test(val)) {
      return decrypt(val)
    }

    // warna plain text return karo
    return val

  } catch (err) {
    console.warn("Decrypt failed, returning raw value")
    return val
  }
}

export const getAllApplications = async () => {

  const query = `
  SELECT 
    la.*,

    -- prefer joined user fields (when loan_applications.user_id is set)
    u.full_name AS user_full_name,
    u.dob AS user_dob,
    u.phone AS user_phone,
    u.email AS user_email,
    u.address AS user_address,
    u.city AS user_city,
    u.state AS user_state,
    u.zip AS user_zip,

    idt.ssn AS ssn,
    idt.driver_license AS driver_license,
    idt.dl_state AS dl_state

  FROM loan_applications la
  LEFT JOIN users u ON la.user_id = u.id
  LEFT JOIN identity_details idt ON idt.application_id = la.id
  ORDER BY la.id DESC
  `

  const result = await db.query(query)

  return result.rows.map((row: any) => ({
    ...row,

    // identity fields
    ssn: safeDecrypt(row.ssn),
    driver_license: safeDecrypt(row.driver_license),

    // bank fields
    bank_account: safeDecrypt(row.bank_account),
    routing_number: safeDecrypt(row.routing_number),
    ifsc_code: safeDecrypt(row.ifsc_code),

    // dob may exist on joined user (user_dob) or directly on loan_applications (dob)
    dob: safeDecrypt(row.user_dob || row.dob),

    // user/contact fallback: prefer joined user_*, otherwise use values on loan_applications row
    user_full_name: row.user_full_name || row.full_name || null,
    user_phone: row.user_phone || row.phone || null,
    user_email: row.user_email || row.email || null,
    user_address: row.user_address || row.address || null,
    user_city: row.user_city || row.city || null,
    user_state: row.user_state || row.state || null,
    user_zip: row.user_zip || row.zip || null,
  }))
}


// export const getApplicationById = async (id:number) => {

//   const query = `
//   SELECT 
//     la.*,

//     u."fullName" AS full_name,
//     u.dob AS dob,
//     u.phone,
//     u.email,
//     u.address,
//     u.city,
//     u.state,
//     u.zip,

//     idt.ssn AS ssn,
//     idt.driver_license AS driver_license,
//     idt.dl_state AS dl_state

//   FROM loan_applications la
//   LEFT JOIN users u ON la.user_id = u.id
//   LEFT JOIN identity_details idt ON idt.application_id = la.id
//   WHERE la.id = $1
//   `

//   const result = await db.query(query,[id])

//   const row = result.rows[0]

//   if(!row) return null

//   return {
//     ...row,

//     ssn: safeDecrypt(row.ssn),
//     driver_license: safeDecrypt(row.driver_license),

//     bank_account: safeDecrypt(row.bank_account),
//     routing_number: safeDecrypt(row.routing_number),
//     ifsc_code: safeDecrypt(row.ifsc_code),

//     dob: safeDecrypt(row.dob)
//   }
// }


export const getApplicationById = async (id:number) => {

  const result = await db.query(`
  SELECT
  la.*,

  u.full_name as user_full_name,
  u.phone as user_phone,
  u.email as user_email,
  u.address as user_address,
  u.city as user_city,
  u.state as user_state,
  u.zip as user_zip,
  u.dob as user_dob

  FROM loan_applications la

  LEFT JOIN users u
  ON la.user_id = u.id

  WHERE la.id=$1
  `,[id])

  const row = result.rows[0]

  if(!row) return null

  return {
    ...row,
    ssn: row.ssn ? decrypt(row.ssn) : null,
    driver_license: row.driver_license ? decrypt(row.driver_license) : null,

    // expose consistent user fields (prefer joined user, fallback to loan_applications)
    user_full_name: row.user_full_name || row.full_name || null,
    user_phone: row.user_phone || row.phone || null,
    user_email: row.user_email || row.email || null,
    user_address: row.user_address || row.address || null,
    user_city: row.user_city || row.city || null,
    user_state: row.user_state || row.state || null,
    user_zip: row.user_zip || row.zip || null,

    dob: row.user_dob ? safeDecrypt(row.user_dob) : safeDecrypt(row.dob)
  }
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