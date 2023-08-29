// class responsable about prediction errors
class ApiError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith(400) ? 'failed' : 'error'
        this.isOperational = true
    }
}

module.exports = ApiError