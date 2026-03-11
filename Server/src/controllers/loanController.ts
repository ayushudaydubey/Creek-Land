import { Request, Response } from "express"
import { saveBank, saveIdentity } from "../services/loanService"

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