import express from "express"
import {
 getApplicationsController,
 getApplicationController,
 updateStatusController
} from "../controllers/adminController"

import { authMiddleware } from "../middleware/authMiddleware"
import { roleMiddleware } from "../middleware/roleMiddleware"
import { geoBlockMiddleware } from "../middleware/geoBlockMiddleware"

const router = express.Router()

router.use(authMiddleware)
router.use(roleMiddleware("admin"))
router.use(geoBlockMiddleware)

router.get("/applications",getApplicationsController)

router.get("/application/:id",getApplicationController)

router.patch("/application/status",updateStatusController)

export default router