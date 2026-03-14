"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import API from "@/lib/api"

type ApplicationDetail = {
  id: number
  status?: string
  loan_amount?: number | null
  loan_purpose?: string | null
  bank_name?: string | null
  bank_account?: string | null
  routing_number?: string | null
  ifsc_code?: string | null
  full_name?: string | null
  dob?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
  ssn?: string | null
  driver_license?: string | null
  dl_state?: string | null
  sms_consent?: boolean | null
  call_consent?: boolean | null
  email_consent?: boolean | null
  created_at?: string | null
}

const maskSSN = (s?: string | null) => {
  if (!s) return "-"
  const digits = s.replace(/\D/g, "")
  return "***-**-" + digits.slice(-4)
}

const maskAccount = (v?: string | null) => {
  if (!v) return "-"
  const s = String(v)
  return "****" + s.slice(-4)
}

const maskRouting = (v?: string | null) => {
  if (!v) return "-"
  const s = String(v)
  return "****" + s.slice(-4)
}

const formatDate = (iso?: string | null) => {
  if (!iso) return "-"
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export default function ApplicationPage() {
  const params = useParams() as { id?: string }
  const router = useRouter()

  const id = Number(params?.id)

  const [app, setApp] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  const fetchDetail = async () => {
    if (!id) return

    setLoading(true)

    try {
      const res = await API.get(`/admin/application/${id}`)

      console.log("Application API response:", res.data)

      // map API fields (user_full_name, user_phone, user_dob, etc.)
      const d = res.data || {}
      const mapped = {
        ...d,
        full_name: d.user_full_name || d.full_name || null,
        phone: d.user_phone || d.phone || null,
        email: d.user_email || d.email || null,
        dob: d.user_dob || d.dob || null,
        address: d.user_address || d.address || null,
        city: d.user_city || d.city || null,
        state: d.user_state || d.state || null,
        zip: d.user_zip || d.zip || null,
      }

      setApp(mapped)
      setStatus(mapped?.status || "")
    } catch (err: any) {
      console.error(err)
      setMessage(err?.response?.data?.message || "Failed to load application")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [params?.id])

  const updateStatus = async () => {
    if (!id) return

    try {
      setLoading(true)

      await API.patch("/admin/application/status", { id, status })

      setMessage("Status updated successfully")

      fetchDetail()
    } catch (err: any) {
      console.error(err)
      setMessage(err?.response?.data?.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6">

      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold mb-6">
          Application #{id}
        </h1>

        {message && (
          <div className="mb-4 text-green-400">
            {message}
          </div>
        )}

        {loading && (
          <div className="text-gray-400">Loading application...</div>
        )}

        {app && (
          <div className="space-y-6">

            {/* USER INFO */}
            <section className="bg-gray-900 p-5 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-3">
                User Information
              </h2>

              <div className="grid md:grid-cols-2 gap-3 text-sm">

                <div>
                  <strong>Name:</strong>
                  <div>{app.full_name ?? "-"}</div>
                </div>

                <div>
                  <strong>Phone:</strong>
                  <div>{app.phone ?? "-"}</div>
                </div>

                <div>
                  <strong>Email:</strong>
                  <div>{app.email ?? "-"}</div>
                </div>

                <div>
                  <strong>Date of Birth:</strong>
                  <div>{app.dob ?? "-"}</div>
                </div>

                <div>
                  <strong>Address:</strong>
                  <div>{app.address ?? "-"}</div>
                </div>

                <div>
                  <strong>City:</strong>
                  <div>{app.city ?? "-"}</div>
                </div>

                <div>
                  <strong>State:</strong>
                  <div>{app.state ?? "-"}</div>
                </div>

                <div>
                  <strong>ZIP:</strong>
                  <div>{app.zip ?? "-"}</div>
                </div>

              </div>
            </section>

            {/* LOAN INFO */}
            <section className="bg-gray-900 p-5 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-3">
                Loan Information
              </h2>

              <div className="grid md:grid-cols-2 gap-3 text-sm">

                <div>
                  <strong>Loan Amount:</strong>
                  <div>{app.loan_amount ?? "-"}</div>
                </div>

                <div>
                  <strong>Loan Purpose:</strong>
                  <div>{app.loan_purpose ?? "-"}</div>
                </div>

                <div>
                  <strong>Bank Name:</strong>
                  <div>{app.bank_name ?? "-"}</div>
                </div>

                <div>
                  <strong>IFSC Code:</strong>
                  <div>{app.ifsc_code ?? "-"}</div>
                </div>

                <div>
                  <strong>Account Number:</strong>
                  <div>{maskAccount(app.bank_account)}</div>
                </div>

                <div>
                  <strong>Routing Number:</strong>
                  <div>{maskRouting(app.routing_number)}</div>
                </div>

                <div>
                  <strong>Status:</strong>
                  <div>{app.status ?? "-"}</div>
                </div>

                <div>
                  <strong>Created:</strong>
                  <div>{formatDate(app.created_at)}</div>
                </div>

              </div>
            </section>

            {/* IDENTITY */}
            <section className="bg-gray-900 p-5 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-3">
                Identity
              </h2>

              <div className="grid md:grid-cols-2 gap-3 text-sm">

                <div>
                  <strong>SSN:</strong>
                  <div>{maskSSN(app.ssn)}</div>
                </div>

                <div>
                  <strong>Driver License:</strong>
                  <div>{app.driver_license ?? "-"}</div>
                </div>

                <div>
                  <strong>DL State:</strong>
                  <div>{app.dl_state ?? "-"}</div>
                </div>

              </div>
            </section>

            {/* CONSENT */}
            <section className="bg-gray-900 p-5 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-3">
                Consent
              </h2>

              <div className="grid md:grid-cols-3 gap-3 text-sm">

                <div>
                  <strong>SMS:</strong>
                  <div>{app.sms_consent ? "Yes" : "No"}</div>
                </div>

                <div>
                  <strong>Call:</strong>
                  <div>{app.call_consent ? "Yes" : "No"}</div>
                </div>

                <div>
                  <strong>Email:</strong>
                  <div>{app.email_consent ? "Yes" : "No"}</div>
                </div>

              </div>
            </section>

            {/* STATUS UPDATE */}
            <section className="bg-gray-900 p-5 rounded-xl shadow">

              <h2 className="text-lg font-semibold mb-3">
                Update Status
              </h2>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-2 bg-gray-800 border border-gray-700 rounded mr-3"
              >
                <option value="pending">pending</option>
                <option value="submitted">submitted</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
              </select>

              <button
                onClick={updateStatus}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Update
              </button>

            </section>

          </div>
        )}

      </div>
    </div>
  )
}