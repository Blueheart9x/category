import { Router } from "express"
import * as functionGroupController from "../../controllers/functions/function_group_controller"
const router = Router()

router.route("/")
    .post(functionGroupController.createOne)

router.route("/:code")
    .get(functionGroupController.getOne)

export default router