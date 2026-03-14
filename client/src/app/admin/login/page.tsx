"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import API from "@/lib/api"

export default function AdminLoginPage(){
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [message,setMessage] = useState<string | null>(null)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try{
      await API.post('/auth/login', { email, password })
      // login sets cookie; redirect to admin dashboard
      router.push('/admin')
    }catch(err:any){
      console.error(err)
      setMessage(err?.response?.data?.message || err?.message || 'Login failed')
    }finally{setLoading(false)}
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      {message && <div className="mb-3 text-red-600">{message}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded" required />
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}
