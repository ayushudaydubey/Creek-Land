"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import API from "@/lib/api"

export default function Step3(){
  const [accountNumber,setAccountNumber] = useState("")
  const [routingNumber,setRoutingNumber] = useState("")
  const [ifscCode,setIfscCode] = useState("")
  const [loading,setLoading] = useState(false)
  const [bankName,setBankName] = useState("")
  const [country,setCountry] = useState<string | null>(null)
  const router = useRouter()

  const lookupBank = async () => {
    // only lookup for routing numbers (US/CA)
    if(!routingNumber) return
    try{
      // call our backend to avoid CORS issues
      const res = await API.get('/loan/bank-lookup', { params: { routingNumber } })
      const bankNameFromServer = res?.data?.data?.bankName ?? null
      if (bankNameFromServer) setBankName(bankNameFromServer)
    }catch(e){
      console.warn(e)
    }
  }

  const submitBank = async (e:any)=>{
    e.preventDefault()
    const applicationId = localStorage.getItem("applicationId")
    if(!applicationId){ alert('No application id'); return }
    const country = localStorage.getItem("country")
    if(!country){ alert('Missing country, please go back and re-select your country'); return }
    setCountry(country)
    setLoading(true)
    try{
      const payload: any = { applicationId: Number(applicationId), accountNumber, country }
      if (country === 'IN') {
        payload.ifscCode = ifscCode
        payload.bankName = bankName
      } else {
        payload.routingNumber = routingNumber
      }

      const res = await API.post('/loan/bank', payload)
      setBankName(res.data.data.bankName || '')
      router.push('/apply/step4-personal')
    }catch(err:any){
      console.error(err)
      alert(err?.response?.data?.message || 'Failed to save bank')
    }finally{setLoading(false)}
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Banking (Step 3)</h2>
      <form onSubmit={submitBank}>
        <label className="block mb-2">Account Number
          <input value={accountNumber} onChange={e=>setAccountNumber(e.target.value)} className="block w-full p-2 border rounded" />
        </label>
        {country === 'IN' ? (
          <>
            <label className="block mb-2">IFSC Code
              <input value={ifscCode} onChange={e=>setIfscCode(e.target.value)} className="block w-full p-2 border rounded" />
            </label>
            <label className="block mb-2">Bank Name
              <input value={bankName} onChange={e=>setBankName(e.target.value)} className="block w-full p-2 border rounded" />
            </label>
          </>
        ) : (
          <label className="block mb-2">Routing / Transit Number
            <input value={routingNumber} onChange={e=>setRoutingNumber(e.target.value)} onBlur={lookupBank} className="block w-full p-2 border rounded" />
          </label>
        )}
        {bankName && <p className="mb-2">Bank: {bankName}</p>}
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading? 'Saving...':'Next'}</button>
      </form>
    </div>
  )
}
