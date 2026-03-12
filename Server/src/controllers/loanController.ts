import { Request, Response } from "express"
import { saveBank, saveConsent, saveIdentity, saveLoan, submitLoan, createApplication } from "../services/loanService"
import { log } from "node:console"

export const identityController = async (req: Request, res: Response) => {

  try {

    const { applicationId, ssn, driverLicense, state } = req.body

    if (!applicationId || !ssn || !driverLicense || !state) {

      return res.status(400).json({
        message: "Missing required fields"
      })

    }

    const result = await saveIdentity({
      applicationId,
      ssn,
      driverLicense,
      state
    })

    res.json({
      message: "Identity information saved",
      data: result
    })

  } catch (error: any) {

    res.status(500).json({
      message: error.message
    })

  }

}


export const bankController = async (req: Request, res: Response) => {

  try {

    const { applicationId, accountNumber, routingNumber } = req.body;

    if (!applicationId || !accountNumber || !routingNumber) {

      return res.status(400).json({
        message: "Missing required fields"
      });

    }

    const result = await saveBank({
      applicationId,
      accountNumber,
      routingNumber
    });

    res.json({
      message: "Bank information saved",
      data: result
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message
    });

  }

};



export const loanRequestController = async (req: Request, res: Response) => {

  try {

    const { applicationId, loanAmount, loanPurpose } = req.body

    if (!applicationId || !loanAmount || !loanPurpose) {
      return res.status(400).json({
        message: "Missing required fields"
      })
    }

    const result = await saveLoan({
      applicationId,
      loanAmount,
      loanPurpose
    })

    res.json({
      message: "Loan request saved",
      data: result
    })

  } catch (error: any) {

    res.status(500).json({
      message: error.message
    })

  }

}



export const consentController = async (req: Request, res: Response) => {

  try {

    const {
      applicationId,
      smsConsent,
      callConsent,
      emailConsent,
      jornayaLeadId,
      trustedFormCertUrl
    } = req.body

    if (!applicationId) {
      return res.status(400).json({
        message: "Application ID required"
      })
    }

    const result = await saveConsent({
      applicationId,
      smsConsent,
      callConsent,
      emailConsent,
      jornayaLeadId,
      trustedFormCertUrl
    })

    res.json({
      message: "Consent recorded",
      data: result
    })

  } catch (error: any) {

    res.status(500).json({
      message: error.message
    })

  }

}




export const submitLoanController = async (req: Request, res: Response) => {

  try {

    const {
      applicationId,
      utmSource,
      utmMedium,
      utmCampaign
    } = req.body

    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress

      console.log(ipAddress)

    if (!applicationId) {
      return res.status(400).json({
        message: "Application ID required"
      })
    }

    const result = await submitLoan({
      applicationId,
      utmSource,
      utmMedium,
      utmCampaign,
      ipAddress: String(ipAddress)
    })

    res.json({
      message: "Loan application submitted successfully",
      data: result
    })

  } catch (error: any) {

    res.status(500).json({
      message: error.message
    })

  }

}

export const createApplicationController = async (req: Request, res: Response) => {
  try {
    const result = await createApplication()

    res.status(201).json({ message: "Application created", data: result })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }

}