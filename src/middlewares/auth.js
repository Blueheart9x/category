import RequestUtil from '../utils/request'
import { ResponseCode } from '../common/constants/response'
import CommonError from '../common/errors/common_error'

export const verifyAuth = (req, res, next) => {
    const token = RequestUtil.getTokenFromRequest(req)

    if (!token) {
        throw new CommonError(ResponseCode.UNAUTHORIZED, 'No token provided')
    }

    try {
        const secretStorage = req.app.get('secret')
        const tokenPayload = RequestUtil.decodeToken(token, secretStorage)
        req.tokenPayload = tokenPayload
        next()
    } catch (error) {
        throw new CommonError(ResponseCode.UNAUTHORIZED, 'Failed to authenticate token')
    }
}