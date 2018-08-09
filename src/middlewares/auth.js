import RequestUtil from '../utils/request'
import ErrorResponseBody from '../common/models/response/error_response_body'
import { ResponseCode } from '../common/constants/response'
import CommonError from '../common/errors/common_error'
import jwt from 'jsonwebtoken'

export const verifyAuth = (req, res, next) => {
    const token = RequestUtil.getTokenFromRequest(req)

    if (!token) {
        const responseBody = new ErrorResponseBody('No token provided')
        return res.status(ResponseCode.UNAUTHORIZED).json(responseBody)
    }

    try {
        const decodedToken = getDecodedToken(req, token)
        req.decoded = decodedToken
        next()
    } catch (error) {
        throw new CommonError(ResponseCode.UNAUTHORIZED, 'Failed to authenticate token')
    }
}

const getDecodedToken = (req, token) => {
    const secret = req.app.get("secret")
    return jwt.verify(token, secret)
}