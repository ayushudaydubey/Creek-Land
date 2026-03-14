import express from  'express'
import cors from 'cors'
import { env } from './config/env'


// import loanRoutes from "./routes/loanRoutes"
import authRoutes from "./routes/authRoutes"
import otpRoutes from "./routes/otp.routes"
import loanRoutes from "./routes/loanRoutes"
import adminRoutes  from  "./routes/adminRoutes"
import cookieParser from "cookie-parser"
import { db } from "./config/db"


const app = express()


// Configure CORS to allow frontend origin (use FRONTEND_URL env when available)
const FRONTEND_ORIGIN = process.env.FRONTEND_URL 
app.use(cors({
	origin: (origin, callback) => {
		// allow requests with no origin (e.g., curl, mobile)
		if (!origin) return callback(null, true)
		if (origin === FRONTEND_ORIGIN) return callback(null, true)
		return callback(new Error('CORS not allowed'), false)
	},
	credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// app.use("/api/loans", loanRoutes)

app.use("/api/auth", authRoutes)
app.use("/api/otp", otpRoutes)
app.use("/api/loan", loanRoutes)
app.use("/api/admin", adminRoutes)

// Development-only debug route to inspect raw application rows (no auth)
if (process.env.NODE_ENV === 'development') {
	app.get('/debug/raw-applications', async (req, res) => {
		try {
			const result = await db.query(`SELECT la.*, u.full_name as user_full_name FROM loan_applications la LEFT JOIN users u ON la.user_id = u.id LIMIT 20`)
			return res.json({ rows: result.rows })
		} catch (err:any) {
			console.error('debug raw-applications error:', err?.stack || err)
			return res.status(500).json({ message: err?.message || 'DB error' })
		}
	})
}


export default app