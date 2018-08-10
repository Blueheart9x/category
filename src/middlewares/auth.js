import RequestUtil from '../utils/request'
import { ResponseCode } from '../common/constants/response'
import CommonError from '../common/errors/common_error'
import jwt from 'jsonwebtoken'

export const verifyAuth = (req, res, next) => {
    const token = RequestUtil.getTokenFromRequest(req)

    if (!token) {
        throw new CommonError(ResponseCode.UNAUTHORIZED, 'No token provided')
    }

    try {
        const decodedToken = decodeToken(req, token)
        req.decoded = decodedToken
        next()
    } catch (error) {
        throw new CommonError(ResponseCode.UNAUTHORIZED, 'Failed to authenticate token')
    }
}

const decodeToken = (req, token) => {
    const secret = req.app.get("secret")
    return jwt.verify(token, secret)
}