import { db } from "../config/db";

// export const saveBankDetails = async (
//   applicationId: number,
//   accountNumber: string,
//   routingNumber: string,
//   bankName: string
// ) => {

//   const query = `
//   UPDATE loan_applications
//   SET
//     bank_account = $1,


export const saveBankDetails = async (
  applicationId: number,
  accountNumber: string,
  routingNumber: string,
  bankName: string
): Promise<{ id: number } | null> => {

  const query = `
  UPDATE loan_applications
  SET
    bank_account = $1,
    routing_number = $2,
    bank_name = $3
  WHERE id = $4
  RETURNING id
  `;

  const values = [
    accountNumber,
    routingNumber,
    bankName,
    applicationId
  ];

  const result = await db.query(query, values);

  return result.rows[0] || null;

};

export const saveIdentityDetails = async (data: import("../models/loanModel").IdentityPayload): Promise<{ id: number } | null> => {

  const query = `
  UPDATE loan_applications
  SET 
    ssn = $1,
    driver_license = $2,
    dl_state = $3
  WHERE id = $4
  RETURNING id
  `;

  const values = [
    data.ssn,
    data.driverLicense,
    data.state,
    data.applicationId
  ];

  const result = await db.query(query, values);

  return result.rows[0] || null;

}