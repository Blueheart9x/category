import bcrypt from 'bcrypt'

const BCRYPT_SALT_ROUNDS = 10

export const CryptPassword = async (plainPassword) => {
    return await bcrypt.hashSync(plainPassword, BCRYPT_SALT_ROUNDS)
}

export const ComparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compareSync(plainPassword, hashedPassword)
}