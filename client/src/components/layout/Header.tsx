import LoanCalculator from "@/components/loan/LoanCalculator";
import ApplyCTA from "@/components/loan/ApplyCTA";

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-4xl font-bold">
        Fast Personal Loans from Creek Lend
      </h1>

      <p className="mt-4 text-gray-600">
        Check your loan eligibility in minutes.
      </p>

      <LoanCalculator />
      <ApplyCTA />
    </main>
  );
}