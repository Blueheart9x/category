let configData = {}
if (process.env.NODE_ENV === undefined || process.env.NODE_ENV == null || process.env.NODE_ENV == 'development') {
    configData = require('../config/development.json')
} else {
    if (process.env.NODE_ENV == 'production') {
        configData = require('../config/production.json')
    }
}

export default configData