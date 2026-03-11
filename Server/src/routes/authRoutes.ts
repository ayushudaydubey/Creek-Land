import express from "express"
import { registerUserController, loginUserController } from "../controllers/userController"

const router = express.Router()

router.post("/register", registerUserController)
router.post("/login", loginUserController)

export default router