import { Router } from 'express'
import * as authController from '../controllers/authentication'
import * as authMiddleware from '../middlewares/auth'
const router = Router()

router.post('/authenticate', authController.authenticate)

router.use('/', authMiddleware.verifyAuth)

export default router