import express from "express"
import { bankController, consentController, identityController, loanRequestController, submitLoanController, createApplicationController } from "../controllers/loanController"

const router = express.Router()

router.post("/identity", identityController)

router.post("/create", createApplicationController)

router.post("/bank", bankController);
router.post("/request", loanRequestController)
router.post("/consent", consentController)
router.post("/submit", submitLoanController)


export default router