import jwt from "jsonwebtoken"
import { SecretStorage } from "../common/constants/system_consts"
import ApiError from "../common/models/response/api_error"
import { ErrorCode, LocationType } from "../common/constants/response_consts"
import omit from "object.omit"

class ResponseUtils {
    static generateNewToken(req, user) {
        const { username, isAdmin } = user
        const payload = {
            username: username,
            isAdmin: isAdmin
        }
        const options = {
            expiresIn: 60 * 1000
        }
        const secret = req.app.get(SecretStorage.TOKEN)
        const token = jwt.sign(payload, secret, options)
    
        return token
    }

    static regenerateToken(req) {
        const decodedToken = req.decodedToken
        return this.generateNewToken(req, decodedToken)
    }

    static bindApiErrorFromMongooseValidatorError(validatorError) {
        const errors = []
        const validatorErrors = validatorError.errors

        for (let fieldName in validatorErrors) {
            const message = validatorErrors[fieldName].message
            errors.push(new ApiError(ErrorCode.INVALID_PARAM, message, LocationType.BODY, `/${fieldName}`))
        }

        return errors
    }

    static getCommonViews() {
        return {
            _id: false,
            isDeleted: false,
            updatedAt: false,
            createdAt: false,
            __v: false
        }
    }

    static getCommonOmits() {
        return ["_id", "isDeleted", "updatedAt", "createdAt", "__v"]
    }

    static removeCommonUnnecessaryFields(record) {
        const skipFields = this.getCommonOmits()
        return omit(record.toJSON(), skipFields)
    }

}

export default ResponseUtils