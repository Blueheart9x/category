import bcrypt from 'bcrypt'

const BCRYPT_SALT_ROUNDS = 10

class PasswordUtil {
    static async hashPassword(plainPassword) {
        return await bcrypt.hashSync(plainPassword, BCRYPT_SALT_ROUNDS)
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compareSync(plainPassword, hashedPassword)
    }
}

export default PasswordUtil