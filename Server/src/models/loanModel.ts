export type CountryCode = 'US' | 'CA' | 'IN' | string

export interface BankPayload {

  applicationId: number
  accountNumber: string
  routingNumber?: string
  ifscCode?: string
  country: CountryCode
  bankName?: string | null

}

export interface IdentityPayload {
  applicationId: number
  ssn: string
  driverLicense: string
  state: string
}

export interface LoanRequestPayload {

  applicationId: number
  loanAmount: number
  loanPurpose: string

}

export interface ConsentPayload {

  applicationId: number
  smsConsent: boolean
  callConsent: boolean
  emailConsent: boolean
  jornayaLeadId?: string
  trustedFormCertUrl?: string

}

export interface SubmitApplicationPayload {

  applicationId: number
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  ipAddress?: string

}