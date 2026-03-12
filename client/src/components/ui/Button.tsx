export default function Button({ children, onClick, className = "" }) {
	return (
		<button
			onClick={onClick}
			className={"inline-flex items-center justify-center px-4 py-2 rounded-md font-medium shadow-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 " + className}
		>
			{children}
		</button>
	)
}
