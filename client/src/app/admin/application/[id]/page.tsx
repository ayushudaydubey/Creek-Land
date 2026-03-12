"use client"
import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import API from "@/lib/api"

type ApplicationDetail = {
  id: number
  status: string
  loan_amount?: number
  loan_purpose?: string
  bank_name?: string | null
  created_at?: string
}

export default function ApplicationPage(){
  const params = useParams() as { id?: string }
  const id = Number(params?.id)
  const router = useRouter()

  const [app,setApp] = useState<ApplicationDetail | null>(null)
  const [loading,setLoading] = useState(false)
  const [status,setStatus] = useState('')
  const [message,setMessage] = useState<string | null>(null)

  const fetchDetail = async ()=>{
    if(!id) return
    setLoading(true)
    try{
      const res = await API.get(`/admin/application/${id}`)
      setApp(res.data || null)
      setStatus(res.data?.status || '')
    }catch(err:any){
      console.error(err)
      setMessage(err?.response?.data?.message || err.message || 'Failed to load')
    }finally{setLoading(false)}
  }

  useEffect(()=>{ fetchDetail() }, [params?.id])

  const updateStatus = async ()=>{
    if(!id) return
    setLoading(true)
    setMessage(null)
    try{
      await API.patch('/admin/application/status', { id, status })
      setMessage('Status updated')
      fetchDetail()
    }catch(err:any){
      console.error(err)
      setMessage(err?.response?.data?.message || err.message || 'Update failed')
    }finally{setLoading(false)}
  }

  return (
    <div className="p-6 max-w-3xl">
      <button className="mb-4 px-3 py-1 bg-gray-200 rounded" onClick={()=>router.back()}>Back</button>
      <h1 className="text-2xl font-bold mb-4">Application #{id}</h1>
      {message && <div className="mb-3 text-sm text-green-700">{message}</div>}
      {loading && <div>Loading...</div>}
      {app && (
        <div className="space-y-3">
          <div><strong>Status:</strong> {app.status}</div>
          <div><strong>Loan Amount:</strong> {app.loan_amount ?? '-'}</div>
          <div><strong>Loan Purpose:</strong> {app.loan_purpose ?? '-'}</div>
          <div><strong>Bank:</strong> {app.bank_name ?? '-'}</div>

          <div className="mt-4">
            <label className="block mb-2">Set Status
              <select value={status} onChange={e=>setStatus(e.target.value)} className="block w-64 p-2 border rounded">
                <option value="pending">pending</option>
                <option value="submitted">submitted</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
              </select>
            </label>
            <button onClick={updateStatus} className="px-4 py-2 bg-blue-600 text-white rounded">Update Status</button>
          </div>
        </div>
      )}
    </div>
  )
}
