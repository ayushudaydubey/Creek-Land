import { CountryCode } from "../models/loanModel";

export class ValidationError extends Error {
  public readonly status = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateBankPayload = (payload: {
  accountNumber?: string
  routingNumber?: string | null | undefined
  ifscCode?: string | null | undefined
  country?: CountryCode | null | undefined
  bankName?: string | null | undefined
}) => {

  const country = (payload.country || 'US') as CountryCode

  if (!payload.accountNumber) {
    throw new ValidationError('accountNumber is required')
  }

  switch (country.toUpperCase()) {
    case 'US':
    case 'CA':
      if (!payload.routingNumber) {
        throw new ValidationError('routingNumber is required for US/CA')
      }
      if (payload.ifscCode) {
        throw new ValidationError('ifscCode is not valid for US/CA')
      }
      break
    case 'IN':
      if (!payload.ifscCode) {
        throw new ValidationError('ifscCode is required for India')
      }
      if (payload.routingNumber) {
        throw new ValidationError('routingNumber is not valid for India')
      }
      if (!payload.bankName) {
        throw new ValidationError('bankName is required for India')
      }
      break
    default:
      // Default: require accountNumber and accept whichever fields present
      break
  }

  return {
    accountNumber: payload.accountNumber,
    routingNumber: payload.routingNumber || null,
    ifscCode: payload.ifscCode || null,
    country,
    bankName: payload.bankName || null
  }


}
