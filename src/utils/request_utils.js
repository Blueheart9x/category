import jwt from "jsonwebtoken"

class RequestUtils {
    static getTokenFromRequest(req) {
        const requestHeaders = req.headers
        return requestHeaders["x-access-token"]
    }

    static decodeToken(token, secretStorage) {
        return jwt.verify(token, secretStorage)
    }
}

export default RequestUtils