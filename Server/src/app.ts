import express from  'express'
import cors from 'cors'
import { env } from './config/env'


// import loanRoutes from "./routes/loanRoutes"
import authRoutes from "./routes/authRoutes"
import otpRoutes from "./routes/otp.routes"
import loanRoutes from "./routes/loanRoutes"
import adminRoutes  from  "./routes/adminRoutes"
import cookieParser from "cookie-parser"


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
app.use(cookieParser())


// app.use("/api/loans", loanRoutes)

app.use("/api/auth", authRoutes)
app.use("/api/otp", otpRoutes)
app.use("/api/loan", loanRoutes)
app.use("/api/admin", adminRoutes)


export default app