import express from "express"
import { bankController, consentController, identityController, loanRequestController } from "../controllers/loanController"

const router = express.Router()

router.post("/identity", identityController)

router.post("/bank", bankController);
router.post("/request", loanRequestController)
router.post("/consent", consentController)


export default router