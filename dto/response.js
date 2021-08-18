class ResponseDTO {
    constructor(statusCode, body, errorMessage) {
        this.statusCode = statusCode;
        this.body = body;
        this.errorMessage = errorMessage;
    }
}

class ErrorMessage {
    constructor(message) {
        this.message = message;
    }
}

module.exports = {
    ResponseDTO,
    ErrorMessage
}