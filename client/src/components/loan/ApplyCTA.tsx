"use client"
import Link from "next/link"

export default function ApplyCTA(){
	return (
		<div className="p-6 bg-gradient-to-r from-green-50 to-white rounded-lg shadow-md text-center">
			<h3 className="text-xl font-semibold mb-2">Ready to check your rate?</h3>
			<p className="text-gray-600 mb-4">No obligation — see personalized offers in minutes.</p>
			<Link href="/apply" className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">Check Your Rate</Link>
		</div>
	)
}
