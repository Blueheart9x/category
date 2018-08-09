import bcrypt from 'bcrypt'

const BCRYPT_SALT_ROUNDS = 10

class EncryptionUtil {
    static async cryptPassword(plainPassword) {
        return await bcrypt.hashSync(plainPassword, BCRYPT_SALT_ROUNDS)
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compareSync(plainPassword, hashedPassword)
    }
}

export default EncryptionUtil