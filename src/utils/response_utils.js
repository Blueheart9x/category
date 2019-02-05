import jwt from "jsonwebtoken"
import { SecretStorage } from "../common/constants/system_consts"

class ResponseUtils {
    static generateNewToken(req, user) {
        const { username, isAdmin } = user
        const payload = {
            username: username,
            isAdmin: isAdmin
        }
        const options = {
            expiresIn: 60 * 1000
        }
        const secret = req.app.get(SecretStorage.TOKEN)
        const token = jwt.sign(payload, secret, options)
    
        return token
    }

    static regenerateToken(req) {
        const decodedToken = req.decodedToken
        return this.generateNewToken(req, decodedToken)
    }
}

export default ResponseUtils