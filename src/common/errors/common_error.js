class CommonError {
    constructor(status, message, errors) {
        this.status = status
        this.message = message
        this.errors = errors
    }
}

export default CommonError