"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import API from "@/lib/api"

type Application = {
  id: number
  status?: string
  loan_amount?: number | null
  user_full_name?: string | null
  full_name?: string | null
  created_at?: string | null
  [key: string]: any
}

const formatDate = (iso?: string | null) => {
  if (!iso) return "-"
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch (e) {
    return iso
  }
}

export default function AdminIndex() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchApps = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await API.get("/admin/applications")
      setApps(res.data || [])
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.message || err.message || "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApps()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">Admin Applications</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading applications...</div>
      ) : (
        <div className="grid gap-5">
          {apps.map((a) => {
            const name = a.user_full_name || a.full_name || "-"
            return (
              <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg hover:shadow-indigo-500/10 transition">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Application ID</p>
                    <p className="text-lg font-semibold text-indigo-400">#{a.id}</p>

                    <p className="text-sm mt-2 text-gray-300">{name}</p>
                    <p className="text-xs text-gray-500 mt-1">Submitted: {formatDate(a.created_at)}</p>
                  </div>

                  <div className="ml-auto flex flex-col items-end gap-2">
                    <div className="text-sm text-gray-400">Loan
                      <div className="text-white ml-1 font-semibold">{a.loan_amount ?? "-"}</div>
                    </div>

                    <div>
                      <span className="inline-block px-3 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: a.status === 'approved' ? '#059669' : a.status === 'rejected' ? '#dc2626' : '#4f46e5' }}>
                        {a.status ?? 'pending'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/admin/application/${a.id}`} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm">Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}