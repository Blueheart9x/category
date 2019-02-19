import { Router } from "express"
import * as functionGroupController from "../../controllers/functions/function_group_controller"
const router = Router()

router.route("/")
    .post(functionGroupController.createOne)
    .get(functionGroupController.getList)

router.route("/:code")
    .get(functionGroupController.getOne)
    .delete(functionGroupController.deleteOne)
    .patch(functionGroupController.updateOne)

export default router