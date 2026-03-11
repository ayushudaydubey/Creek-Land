import { Request,Response } from "express"
import {
 fetchApplications,
 fetchApplication,
 changeApplicationStatus
} from "../services/adminService"

export const getApplicationsController = async (req:Request,res:Response)=>{

 const data = await fetchApplications()

 res.json(data)
}

export const getApplicationController = async (req:Request,res:Response)=>{

 const id = Number(req.params.id)

 const data = await fetchApplication(id)

 res.json(data)
}

export const updateStatusController = async (req:Request,res:Response)=>{

 const {id,status} = req.body

 const result = await changeApplicationStatus(id,status)

 res.json(result)
}