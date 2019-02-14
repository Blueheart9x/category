import jwt from "jsonwebtoken"
import { SecretStorage } from "../common/constants/system_consts"
import ApiError from "../common/models/response/api_error"
import { ErrorCode, LocationType } from "../common/constants/response_consts"

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
}

export default ResponseUtils