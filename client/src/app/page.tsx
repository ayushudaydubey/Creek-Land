import LoanCalculator from "@/components/loan/LoanCalculator";
import ApplyCTA from "@/components/loan/ApplyCTA";

export default function HomePage() {
	return (
		<main className="min-h-screen bg-gray-50">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-4">Welcome to Creek Lend</h1>
				<LoanCalculator />
				<div className="mt-6">
					<ApplyCTA />
				</div>
			</div>
		</main>
	)
}
