import { Request, Response } from "express"

import {
  fetchApplications,
  fetchApplication,
  changeApplicationStatus
} from "../services/adminService"


// GET ALL APPLICATIONS
export const getApplicationsController = async (req: Request, res: Response) => {

  try {

    const data = await fetchApplications()

    res.json(data)

  } catch (err: any) {

    console.error(err)

    res.status(500).json({
      message: err.message || "Server error"
    })

  }

}


// GET SINGLE APPLICATION
export const getApplicationController = async (req: Request, res: Response) => {

  try {

    const id = Number(req.params.id)

    const data = await fetchApplication(id)

    if (!data) {
      return res.status(404).json({
        message: "Application not found"
      })
    }

    res.json(data)

  } catch (err: any) {

    console.error(err)

    res.status(500).json({
      message: err.message || "Server error"
    })

  }

}


// UPDATE APPLICATION STATUS
export const updateStatusController = async (req: Request, res: Response) => {

  try {

    const { id, status } = req.body

    if (!id || !status) {
      return res.status(400).json({
        message: "id and status are required"
      })
    }

    const result = await changeApplicationStatus(id, status)

    res.json(result)

  } catch (err: any) {

    console.error(err)

    res.status(500).json({
      message: err.message || "Server error"
    })

  }

}