"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import API from "@/lib/api"

export default function Step2(){
  const [ssn,setSsn] = useState("")
  const [dl,setDl] = useState("")
  const [stateVal,setStateVal] = useState("")
  const [loading,setLoading] = useState(false)
  const router = useRouter()

  const submitIdentity = async (e:any)=>{
    e.preventDefault()
    const applicationId = localStorage.getItem("applicationId")
    if(!applicationId){ alert('No application id found'); return }
    setLoading(true)
    try{
      await API.post('/loan/identity',{ applicationId: Number(applicationId), ssn, driverLicense: dl, state: stateVal })
      router.push('/apply/step3-personal')
    }catch(err:any){
      console.error(err)
      alert(err?.response?.data?.message || 'Failed to save identity')
    }finally{setLoading(false)}
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Identity (Step 2)</h2>
      <form onSubmit={submitIdentity}>
        <label className="block mb-2">SSN / National ID
          <input value={ssn} onChange={e=>setSsn(e.target.value)} className="block w-full p-2 border rounded" />
        </label>
        <label className="block mb-2">Driver License
          <input value={dl} onChange={e=>setDl(e.target.value)} className="block w-full p-2 border rounded" />
        </label>
        <label className="block mb-4">DL State/Province
          <input value={stateVal} onChange={e=>setStateVal(e.target.value)} className="block w-full p-2 border rounded" />
        </label>
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading? 'Saving...':'Next'}</button>
      </form>
    </div>
  )
}
