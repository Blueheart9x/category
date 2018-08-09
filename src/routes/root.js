import { Router } from 'express';
const router = Router()

router.use((req, res, next) => {
    next()
})

router.post('/authenticate', (req, res) => {
    
})

export default router