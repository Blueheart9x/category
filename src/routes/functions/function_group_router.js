import { Router } from "express"
import * as functionGroupController from "../../controllers/functions/function_group_controller"
const router = Router()

router.route("/")
    .post(functionGroupController.createOne)

export default router