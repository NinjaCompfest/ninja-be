const { ResponseDTO, ErrorMessage } = require("../dto/response");
const httpStatusCode = require("http-status-codes");
const bcrypt = require("bcryptjs");

class Manager {
    constructor(repository) {
        this.repository = repository;
    }

    login(request) {
        const user = this.repository.getUserByUsername(request.username);
        if (user == null || user == undefined) {
            const response = new ResponseDTO(
                httpStatusCode.StatusCodes.NOT_FOUND,
                null,
                new ErrorMessage("user not found")
            );
            return response;
        }

        const isVerified = bcrypt.compareSync(request.password, user.password);

        if (!isVerified) {
            const response = new ResponseDTO(
                httpStatusCode.StatusCodes.UNAUTHORIZED,
                null,
                new ErrorMessage("username or password is wrong")
            );
            return response;
        }

        // TODO
        // return new ResponseDTO(httpStatusCode.StatusCodes.OK, user);
    }
}

module.exports = {
    Manager,
};
