export interface BankPayload {

  applicationId: number
  accountNumber: string
  routingNumber: string

}

export interface IdentityPayload {
  applicationId: number
  ssn: string
  driverLicense: string
  state: string
}