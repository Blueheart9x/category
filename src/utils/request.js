import jwt from 'jsonwebtoken'

class RequestUtil {
    static getTokenFromRequest(req) {
        const requestHeaders = req.headers
        return requestHeaders['x-access-token']
    }

    static decodeToken(token, secretStorage) {
        return jwt.verify(token, secretStorage)
    }
}

export default RequestUtil