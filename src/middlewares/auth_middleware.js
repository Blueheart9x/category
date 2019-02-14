import RequestUtils from "../utils/request_utils"
import ResponseUtils from "../utils/response_utils"
import { ResponseCode } from "../common/constants/response_consts"
import CommonError from "../common/errors/common_error"
import { SecretStorage } from "../common/constants/system_consts"

export const verifyAuth = (req, res, next) => {
    const token = RequestUtils.getTokenFromRequest(req)

    if (!token) {
        throw new CommonError(ResponseCode.UNAUTHORIZED, "No token provided")
    }

    try {
        const decodedToken = RequestUtils.decodeToken(token, req.app.get(SecretStorage.TOKEN))
        req.decodedToken = decodedToken

        const newToken = ResponseUtils.regenerateToken(req)
        res.header("new-token", newToken)
        next()
    } catch (error) {
        console.log(error)
        throw new CommonError(ResponseCode.UNAUTHORIZED, "Failed to authenticate token")
    }
}