"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import API from "@/lib/api"

type Application = {
  id: number
  status: string
  created_at?: string
  updated_at?: string
  loan_amount?: number
}

export default function AdminIndex(){
  const [apps,setApps] = useState<Application[]>([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState<string | null>(null)

  const fetchApps = async ()=>{
    setLoading(true)
    setError(null)
    try{
      const res = await API.get('/admin/applications')
      setApps(res.data || [])
    }catch(err:any){
      console.error(err)
      setError(err?.response?.data?.message || err.message || 'Failed to load')
    }finally{setLoading(false)}
  }

  useEffect(()=>{ fetchApps() }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin — Applications</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="mb-4">
        <button onClick={fetchApps} className="px-3 py-2 bg-blue-600 text-white rounded">Refresh</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Loan Amount</th>
              <th className="px-4 py-2 border">Created</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(a=> (
              <tr key={a.id} className="odd:bg-gray-50">
                <td className="px-4 py-2 border">{a.id}</td>
                <td className="px-4 py-2 border">{a.status}</td>
                <td className="px-4 py-2 border">{a.loan_amount ?? '-'}</td>
                <td className="px-4 py-2 border">{a.created_at ?? '-'}</td>
                <td className="px-4 py-2 border">
                  <Link href={`/admin/application/${a.id}`} className="px-3 py-1 bg-gray-200 rounded">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
