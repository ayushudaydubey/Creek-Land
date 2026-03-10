import express from  'express'

// import loanRoutes from "./routes/loanRoutes"
import authRoutes from "./routes/authRoutes"
import otpRoutes from "./routes/otp.routes"
import loanRoutes from "./routes/loanRoutes"
const app = express()

// app.use(cors())
app.use(express.json())


// app.use("/api/loans", loanRoutes)

app.use("/api/auth", authRoutes)
app.use("/api/otp", otpRoutes)


app.use("/api/loan", loanRoutes)

export default app