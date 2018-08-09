class ApiError {
    constructor(errorCode, message, locationType, location) {
        this.code = errorCode
        this.message = message
        this.locationType = locationType
        this.location = location
    }
}

export default ApiError