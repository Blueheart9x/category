class SuccessResponseBody {
    constructor(data) {
       for (let key in data) {
           this[key] = data[key]
       }
    }
}

export default SuccessResponseBody