import jwt from "jsonwebtoken"
import DataUtils from "./data_utils"
import { ExceptionType } from "../common/constants/exception_consts"
import CommonException from "../common/exceptions/common_exception";

class RequestUtils {
    static getTokenFromRequest(req) {
        const requestHeaders = req.headers
        return requestHeaders["x-access-token"]
    }

    static decodeToken(token, secretStorage) {
        return jwt.verify(token, secretStorage)
    }

    static getPage(limit, offset) {
        if (!DataUtils.isHasValue(limit) && !DataUtils.isHasValue(offset)) {
            return {
                limit: Number.MAX_SAFE_INTEGER,
                skip: 0
            }
        }

        if (!DataUtils.isHasValue(limit)) {
            if (!DataUtils.isNumber(offset) || DataUtils.toDecimalInt(offset) < 0 || DataUtils.toDecimalInt(offset) > Number.MAX_SAFE_INTEGER) {
                throw new CommonException(ExceptionType.INVALID_VALUE, "Offset must be number and offset greater than 0", "/offset")
            }

            return {
                limit: Number.MAX_SAFE_INTEGER,
                skip: DataUtils.toDecimalInt(offset)
            }
        }

        if (!DataUtils.isHasValue(offset)) {
            if (!DataUtils.isNumber(limit) || DataUtils.toDecimalInt(limit) < 1 || DataUtils.toDecimalInt(limit) > Number.MAX_SAFE_INTEGER) {
                throw new CommonException(ExceptionType.INVALID_VALUE, `Limit must be number in [1..${Number.MAX_SAFE_INTEGER}]`, "/limit")
            }

            return {
                limit: DataUtils.toDecimalInt(limit),
                skip: 0
            }
        }

        return {
            limit: DataUtils.toDecimalInt(limit),
            skip: DataUtils.toDecimalInt(offset)
        }
    }
}

export default RequestUtils