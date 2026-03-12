"use client"
import Link from "next/link"

export default function ApplyIndex(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full p-6">
        <h1 className="text-3xl font-bold mb-4">Start your application</h1>
        <p className="mb-6">Fast, secure, and confidential. The application takes 4 simple steps.</p>
        <Link href="/apply/step1-personal">
          <button className="px-6 py-3 bg-blue-600 text-white rounded">Start Application</button>
        </Link>
      </div>
    </div>
  )
}
