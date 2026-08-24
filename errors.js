class AppError extends Error {
    constructor(statusCode, code, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;

        this.name = "AppError";
    }
}
module.exports = AppError;