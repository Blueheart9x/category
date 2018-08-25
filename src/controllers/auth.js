import User from '../models/user'
import ErrorResponseBody from '../common/models/response/error_response_body'
import { ResponseCode } from '../common/constants/response'
import PasswordUtil from '../utils/password'
import jwt from 'jsonwebtoken'
import CommonError from '../common/errors/common_error'

export const authenticate = (req, res) => {
    const requestBody = req.body
    const username = requestBody.username
    const password = requestBody.password

    User.findOne({
        'username': username,
        'isDeleted': false
    })
    .then(async user => {
        if (!user) {
            throw new CommonError(ResponseCode.UNAUTHORIZED, "User not found")
        }

        const isMatchPassword = await PasswordUtil.comparePassword(password, user.password)

        if (!isMatchPassword) {
            throw new CommonError(ResponseCode.UNAUTHORIZED, "Wrong password")
        }

        const token = generateToken(req, user)

        const responseBody = {
            "username": user.username,
            "name": user.name,
            "token": token
        }

        return res.status(ResponseCode.OK).json(responseBody)
    })
    .catch(error => {
        const responseBody = new ErrorResponseBody(error.message)
        return res.status(error.status).json(responseBody)
    })
}

const generateToken = (req, user) => {
    const username = user.username
    const payload = {
        "username": username
    }
    const options = {
        expiresIn: 60 * 60
    }
    const secret = req.app.get('secret')
    const token = jwt.sign(payload, secret, options)

    return token
}