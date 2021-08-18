const { ResponseDTO, ErrorMessage } = require("../dto/response");
const httpStatusCode = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { LoginResponseDTO } = require("../dto/login");

class Manager {
    constructor(repository) {
        this.repository = repository;
    }

    async login(request) {
        const user = await this.repository.getUserByUsername(request.username);
        console.log("request", request)
        console.log("manager, user", user)
        
        if (user === null || user === undefined) {
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

        user.password = undefined;
        const maxAge = 24 * 60 * 60;
        const jwtToken = jwt.sign({ user }, process.env.JWT_KEY, {
            expiresIn: maxAge,
        });

        return new ResponseDTO(
            httpStatusCode.StatusCodes.OK,
            new LoginResponseDTO(user, jwtToken),
            null
        );
    }
}

module.exports = {
    Manager,
};
