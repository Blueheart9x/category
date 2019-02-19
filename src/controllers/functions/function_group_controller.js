import FunctionGroup from "../../models/functions/function_group"
import CommonError from "../../common/errors/common_error"
import { ResponseCode, ErrorMessage, ErrorCode, LocationType } from "../../common/constants/response_consts"
import ApiError from "../../common/models/response/api_error"
import PagedResponseBody from "../../common/models/response/paged_response_body"
import ValidationError from "mongoose/lib/error/validation"
import ResponseUtils from "../../utils/response_utils"
import DataUtils from "../../utils/data_utils";
import RequestUtils from "../../utils/request_utils";
import CommonException from "../../common/exceptions/common_exception";

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

export const getOne = async (req, res) => {
    const requestParams = req.params
    const code = requestParams.code

    const functionGroup = await getFunctionGroup(code)

    if (!functionGroup) {
        throw new CommonError(ResponseCode.NOT_FOUND, ErrorMessage.NOT_FOUND)
    }

    const responseBody = ResponseUtils.removeCommonUnnecessaryFields(functionGroup)
    return res.status(ResponseCode.OK).json(responseBody)
}

export const deleteOne = async (req, res) => {
    const requestParams = req.params
    const code = requestParams.code

    const functionGroup = await getFunctionGroup(code)

    if (!functionGroup) {
        throw new CommonError(ResponseCode.NOT_FOUND, ErrorMessage.NOT_FOUND)
    }

    const functionGroupUpdate = {
        code: code,
        isDeleted: true
    }

    await updateFunctionGroup(functionGroupUpdate)

    return res.status(ResponseCode.NO_CONTENT).send()
}

export const updateOne = async (req, res) => {
    const requestParams = req.params
    const code = requestParams.code

    const requestBody = req.body

    const functionGroup = await getFunctionGroup(code)

    if (!functionGroup) {
        throw new CommonError(ResponseCode.NOT_FOUND, ErrorMessage.NOT_FOUND)
    }

    try {
        validateFieldForUpdate(requestBody)
        const functionGroupUpdate = getFunctionGroupForUpdate(code, functionGroup, requestBody)
        await updateFunctionGroup(functionGroupUpdate)
    } catch (error) {
        throw new CommonError(ResponseCode.VALIDATION_FAILED, ErrorMessage.VALIDATION_FAILED, error)
    }
}

const validateFieldForUpdate = (requestBody) => {
    const { name, description } = requestBody
    const errors = []


    if (DataUtils.isHasValue(name) && !DataUtils.isValidName(name)) {
        errors.push(new ApiError(ErrorCode.INVALID_PARAM, "Invalid name", LocationType.QUERY, "/name"))
    }

    if (DataUtils.isHasValue(description) && !DataUtils.isValidCommonText(description)) {
        errors.push(new ApiError(ErrorCode.INVALID_PARAM, "Invalid description", LocationType.QUERY, "/description"))
    }

    if (errors.length) {
        throw errors
    }
}

const getFunctionGroupForUpdate = (code, functionGroup, requestBody) => {
    return {
        code: code,
        name: requestBody.name || functionGroup.name,
        description: requestBody.description || functionGroup.description
    }
}

export const getList = async (req, res) => {
    const requestQuery = req.query
    const { limit, offset } = requestQuery

    try {
        validateQueryForList(requestQuery)
        const firstConditions = getFirstConditionsForList(requestQuery)
        const lastCondition = getLastConditionsForList(requestQuery)
        const page = RequestUtils.getPage(limit, offset)
        const defaultPage = RequestUtils.getDefaultPage()

        const functionGroupsPromise = getListFunctionGroup(firstConditions, lastCondition, page)
        const functionGroupsWithOutPagePromise = getListFunctionGroup(firstConditions, lastCondition, defaultPage)
        
        const functionGroups = await functionGroupsPromise
        const functionGroupsWithOutPage = await functionGroupsWithOutPagePromise

        const responseBody = new PagedResponseBody(functionGroups, functionGroupsWithOutPage.length, offset)

        return res.status(ResponseCode.OK).json(responseBody)
    } catch (error) {
        let errors = []
        if (error instanceof CommonException) {
            errors.push(new ApiError(ErrorCode.INVALID_PARAM, error.message, LocationType.BODY, error.location))
        } else {
            errors = error
        }

        throw new CommonError(ResponseCode.VALIDATION_FAILED, ErrorMessage.VALIDATION_FAILED, errors)
    }
}

const validateQueryForList = (requestQuery) => {
    const { code, name, description, keyword } = requestQuery
    const errors = []

    if (DataUtils.isHasValue(code) && !DataUtils.isValidCode(code)) {
        errors.push(new ApiError(ErrorCode.INVALID_PARAM, "Invalid code", LocationType.QUERY, "/code"))
    }

    if (DataUtils.isHasValue(name) && !DataUtils.isValidName(name)) {
        errors.push(new ApiError(ErrorCode.INVALID_PARAM, "Invalid name", LocationType.QUERY, "/name"))
    }

    if (DataUtils.isHasValue(description) && !DataUtils.isValidCommonText(description)) {
        errors.push(new ApiError(ErrorCode.INVALID_PARAM, "Invalid description", LocationType.QUERY, "/description"))
    }

    if (DataUtils.isHasValue(keyword) && !DataUtils.isValidCommonText(keyword)) {
        errors.push(new ApiError(ErrorCode.INVALID_PARAM, "Invalid keyword", LocationType.QUERY, "/keyword"))
    }

    if (errors.length) {
        throw errors
    }
}

const getFirstConditionsForList = (requestQuery) => {
    const { code, name, description } = requestQuery
    const conditions = {}

    if (DataUtils.isHasValue(code)) {
        conditions.code = code
    }

    if (DataUtils.isHasValue(name)) {
        conditions.name = name
    }

    if (DataUtils.isHasValue(description)) {
        conditions.description = description
    }

    return conditions
}

const getLastConditionsForList = (requestQuery) => {
    const keyword = requestQuery.keyword

    if (!DataUtils.isHasValue(keyword)) {
        return null
    }

    return {
        $or: [{
                code: new RegExp(keyword, "i")
            },
            {
                name: new RegExp(keyword, "i")
            },
            {
                description: new RegExp(keyword, "i")
            }
        ]
    }
}

const getListFunctionGroup = async (firstConditions, lastCondition, page) => {
    const query = []
    query.push({
        $match: firstConditions
    })

    if (lastCondition) {
        query.push({
            $match: lastCondition
        })
    }

    const tailQuery = [{
        $skip: page.skip
    }, {
        $limit: page.limit
    }, {
        $sort: {
            createdAt: -1
        }
    }, {
        $project: {
            _id: false,
            code: true,
            name: true,
            description: true
        }
    }]

    Array.prototype.push.apply(query, tailQuery)

    const functionGroups = await FunctionGroup.aggregate(query)

    return functionGroups
}

const updateFunctionGroup = async (functionGroup) => {
    const code = functionGroup.code
    const conditions = {
        code: code,
        isDeleted: false
    }

    await FunctionGroup.findOneAndUpdate(conditions, {
        $set: functionGroup
    })
}

const getFunctionGroup = async (code) => {
    const conditions = {
        code: code,
        isDeleted: false
    }

    const views = ResponseUtils.getCommonViews()

    const functionGroup = await FunctionGroup.findOne(conditions, views)

    return functionGroup
}