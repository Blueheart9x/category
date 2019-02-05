import User from "../models/user"
import { ResponseCode } from "../common/constants/response_consts"
import PasswordUtils from "../utils/password_utils"
import CommonError from "../common/errors/common_error"
import ResponseUtils from "../utils/response_utils"

export const authenticate = async (req, res) => {
    const requestBody = req.body
    const {
        username,
        password
    } = requestBody

    const user = await getUser(username)
    
    if (!user) {
        throw new CommonError(ResponseCode.UNAUTHORIZED, "User not found")
    }

    const isMatchPassword = await PasswordUtils.comparePassword(password, user.password)

    if (!isMatchPassword) {
        throw new CommonError(ResponseCode.UNAUTHORIZED, "Wrong password")
    }

    const token = ResponseUtils.generateNewToken(req, user)

    const responseBody = {
        "username": user.username,
        "name": user.name,
        "token": token
    }

    return res.status(ResponseCode.OK).json(responseBody)
}

const getUser = async (username) => {
    const conditions = {
        username: username,
        isDeleted: false
    }

    const views = {
        username: true,
        password: true,
        name: true
    }

    const user = await User.findOne(conditions, views)

    return user
}