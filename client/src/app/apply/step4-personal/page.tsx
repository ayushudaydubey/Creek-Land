"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import API from "@/lib/api"

export default function Step4(){
  const [smsConsent,setSmsConsent] = useState(true)
  const [callConsent,setCallConsent] = useState(true)
  const [emailConsent,setEmailConsent] = useState(false)
  const [loading,setLoading] = useState(false)
  const router = useRouter()

  const submitAll = async (e:any)=>{
    e.preventDefault()
    const applicationId = localStorage.getItem('applicationId')
    if(!applicationId){ alert('No application id'); return }
    setLoading(true)
    try{
      await API.post('/loan/consent',{ applicationId: Number(applicationId), smsConsent, callConsent, emailConsent })

      // final submit - include UTM if present
      const urlParams = new URLSearchParams(window.location.search)
      const utm_source = urlParams.get('utm_source') || undefined
      const utm_medium = urlParams.get('utm_medium') || undefined
      const utm_campaign = urlParams.get('utm_campaign') || undefined

      await API.post('/loan/submit',{ applicationId: Number(applicationId), utmSource: utm_source, utmMedium: utm_medium, utmCampaign: utm_campaign })

      alert('Application submitted')
      localStorage.removeItem('applicationId')
      router.push('/')
    }catch(err:any){
      console.error(err)
      alert(err?.response?.data?.message || 'Failed to submit')
    }finally{setLoading(false)}
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Review & Consent (Step 4)</h2>
      <form onSubmit={submitAll}>
        <label className="block mb-2"><input type="checkbox" checked={smsConsent} onChange={e=>setSmsConsent(e.target.checked)} /> SMS Consent</label>
        <label className="block mb-2"><input type="checkbox" checked={callConsent} onChange={e=>setCallConsent(e.target.checked)} /> Call Consent</label>
        <label className="block mb-4"><input type="checkbox" checked={emailConsent} onChange={e=>setEmailConsent(e.target.checked)} /> Email Consent</label>
        <button disabled={loading} className="px-4 py-2 bg-green-700 text-white rounded">{loading? 'Submitting...':'Submit Application'}</button>
      </form>
    </div>
  )
}
