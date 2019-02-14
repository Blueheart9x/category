import { Router } from "express"
import * as authController from "../controllers/auth_controller"
import * as authMiddleware from "../middlewares/auth_middleware"

import functionGroupRouter from "../routes/functions/function_group_router"

const router = Router()

router.post("/authenticate", authController.authenticate)

router.use("/", authMiddleware.verifyAuth)
router.use("/function-groups", functionGroupRouter)

export default router