import {
 getAllApplications,
 getApplicationById,
 updateApplicationStatus
} from "../repositories/admin.repository"

export const fetchApplications = async () => {

  return await getAllApplications()
}

export const fetchApplication = async (id:number) => {

  return await getApplicationById(id)
}

export const changeApplicationStatus = async (
  id:number,
  status:string
) => {

  return await updateApplicationStatus(id,status)
}