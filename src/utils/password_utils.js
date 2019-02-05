import bcrypt from "bcryptjs"

const BCRYPT_SALT_ROUNDS = 10

class PasswordUtils {
    static async hashPassword(plainPassword) {
        return await bcrypt.hashSync(plainPassword, BCRYPT_SALT_ROUNDS)
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compareSync(plainPassword, hashedPassword)
    }
}

export default PasswordUtils