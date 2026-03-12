import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="flex items-center justify-between py-4">
			<div className="flex items-center space-x-4">
				<Link href="/" className="text-lg font-bold">Creek Lend</Link>
			</div>
			<div className="flex items-center space-x-3">
				<Link href="/">Home</Link>
				<Link href="/apply" className="text-blue-600 font-medium">Apply</Link>
				<Link href="/how-it-works">How it works</Link>
				<Link href="/faq">FAQ</Link>
				<Link href="/contact">Contact</Link>
			</div>
		</nav>
	)
}
