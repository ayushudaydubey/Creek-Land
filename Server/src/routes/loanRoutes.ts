import express from "express"
import { bankController, identityController } from "../controllers/loanController"

const router = express.Router()

router.post("/identity", identityController)

router.post("/bank", bankController);


export default router