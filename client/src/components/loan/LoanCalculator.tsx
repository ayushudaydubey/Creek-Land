"use client"
import { useState } from "react"

export default function LoanCalculator(){
	const [amount,setAmount] = useState(5000)
	const [term,setTerm] = useState(36)
	const rate = 0.07 // placeholder APR

	const monthly = (amount * (rate/12)) / (1 - Math.pow(1 + rate/12, -term))

	return (
		<section className="p-6 bg-white rounded shadow-md max-w-xl mx-auto my-6">
			<h2 className="text-xl font-semibold mb-3">Estimate your payment</h2>
			<div className="space-y-3">
				<label className="block">
					<span className="text-sm text-gray-600">Loan amount</span>
					<input type="range" min={500} max={50000} step={100} value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-full" />
					<div className="text-lg font-medium">${amount.toLocaleString()}</div>
				</label>

				<label className="block">
					<span className="text-sm text-gray-600">Term (months)</span>
					<select value={term} onChange={e=>setTerm(Number(e.target.value))} className="block w-full p-2 border rounded">
						<option value={24}>24</option>
						<option value={36}>36</option>
						<option value={48}>48</option>
						<option value={60}>60</option>
					</select>
				</label>

				<div className="pt-2">
					<div className="text-sm text-gray-500">Estimated monthly payment</div>
					<div className="text-2xl font-bold">${Number.isFinite(monthly) ? monthly.toFixed(2) : '—'}</div>
				</div>
			</div>
		</section>
	)
}
