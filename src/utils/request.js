class RequestUtil {
    static getTokenFromRequest(req) {
        const requestHeaders = req.headers
        return requestHeaders['x-access-token']
    }
}

export default RequestUtil