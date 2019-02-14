import FunctionGroup from "../../models/functions/function_group"
import CommonError from "../../common/errors/common_error"
import { ResponseCode, ErrorMessage, ErrorCode, LocationType } from "../../common/constants/response_consts"
import ApiError from "../../common/models/response/api_error"
import PagedResponseBody from "../../common/models/response/paged_response_body"
import ValidationError from "mongoose/lib/error/validation"
import ResponseUtils from "../../utils/response_utils"

export const createOne = async (req, res) => {
    const requestBody = req.body
    const code = requestBody.code
    let errors = []

    const functionGroup = await getFunctionGroup(code)

    if (functionGroup) {
        errors.push(new ApiError(ErrorCode.CONFLICT, "Code already exists", LocationType.BODY, "/code"))
        throw new CommonError(ResponseCode.CONFLICT, ErrorMessage.CONFLICT, errors)
    }

    try {
        const result = await FunctionGroup.create(requestBody)
        const responseBody = ResponseUtils.removeCommonUnnecessaryFields(result)
        return res.status(ResponseCode.CREATED).json(responseBody)
    } catch (error) {
        if (!(error instanceof ValidationError)) {
            throw error 
        }
        
        errors = ResponseUtils.bindApiErrorFromMongooseValidatorError(error)
        throw new CommonError(ResponseCode.VALIDATION_FAILED, ErrorMessage.VALIDATION_FAILED, errors)
    }
}

const getFunctionGroup = async (code) => {
    const conditions = {
        code: code,
        isDeleted: false
    }

    const views = {
        code: true,
        name: true,
        description: true
    }

    const functionGroup = await FunctionGroup.findOne(conditions, views)

    return functionGroup
}