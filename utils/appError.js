class AppError extends Error {
    constructor() {
        super()
    }
    static create(message, statusCode, statusText) {
        const error = new AppError()
        error.message = message;
        error.statusCode = statusCode;
        error.statusText = statusText;
        return  error;
    }
}

module.exports = AppError