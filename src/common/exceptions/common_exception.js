class CommonException {
    constructor(type, message, location) {
        this.type = type
        this.message = message
        this.location = location
    }
}

export default CommonException