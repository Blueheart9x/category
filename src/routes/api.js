import { Router } from 'express'
import * as authController from '../controllers/authentication'
const router = Router()

router.post('/authenticate', authController.authenticate)

router.use((req, res, next) => {
    next()
})

export default router