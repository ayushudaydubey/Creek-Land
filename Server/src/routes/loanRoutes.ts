import express from "express"
import { identityController } from "../controllers/loanController"

const router = express.Router()

router.post("/identity", identityController)

export default router