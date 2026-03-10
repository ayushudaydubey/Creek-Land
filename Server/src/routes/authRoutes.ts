import express from "express"
import { registerUserController } from "../controllers/userController"

const router = express.Router()

router.post("/personal-info", registerUserController)

export default router