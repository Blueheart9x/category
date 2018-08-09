import User from '../models/user'
import ErrorResponseBody from '../common/models/response/error_response_body'
import { ResponseCode } from '../common/constants/response'
import { ComparePassword } from '../utils/encryption'
import jwt from 'jsonwebtoken'

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
            const responseBody = new ErrorResponseBody("User not found")
            return res.status(ResponseCode.UNAUTHORIZED).json(responseBody)
        }

        const isMatchPassword = await ComparePassword(password, user.password)

        if (!isMatchPassword) {
            const responseBody = new ErrorResponseBody("Wrong password")
            return res.status(ResponseCode.UNAUTHORIZED).json(responseBody)
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
        throw error
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