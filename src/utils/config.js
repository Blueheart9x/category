const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
const configData = require(`../../config/${env}.json`)

export default configData