import { Router } from "express"
import * as authController from "../controllers/auth_controller.js"
import * as authMiddleware from "../middlewares/auth_middleware"
const router = Router()

router.post("/authenticate", authController.authenticate)

router.use("/", authMiddleware.verifyAuth)

export default router