const httpStatusCode = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ResponseDTO, ErrorMessage } = require("../dto/response");
const { LoginResponseDTO } = require("../dto/login");

class Manager {
    constructor(repository) {
        this.repository = repository;
    }

    async register(request) {
        const salt = bcrypt.genSaltSync(10);
        request.password = bcrypt.hashSync(request.password, salt);
        request.isVerified = request.role === "DONOR" ? true : false;

        const newUser = await this.repository.addUserAndRole(request);
        if (newUser === null || newUser === undefined) {
            const response = new ResponseDTO(
                httpStatusCode.StatusCodes.NOT_FOUND,
                null,
                new ErrorMessage(
                    "failed to register, perhaps the user already exist"
                )
            );
            return response;
        }

        if (newUser.role === "DONOR") {
            newUser.password = undefined;
            const maxAge = 24 * 60 * 60;
            const jwtToken = jwt.sign(newUser, process.env.JWT_KEY, {
                expiresIn: maxAge,
            });

            return new ResponseDTO(
                httpStatusCode.StatusCodes.OK,
                new LoginResponseDTO(newUser, jwtToken),
                null
            );
        }

        if (request.role === "FUNDRAISER") {
            return new ResponseDTO(
                httpStatusCode.StatusCodes.OK,
                { message: "Wait for admin" },
                null
            );
        }
    }

    async login(request) {
        const user = await this.repository.getUserByUsername(request.username);

        if (user === null || user === undefined) {
            return new ResponseDTO(
                httpStatusCode.StatusCodes.NOT_FOUND,
                null,
                new ErrorMessage("user not found")
            );
        }

        const isVerified = bcrypt.compareSync(request.password, user.password);

        if (!isVerified) {
            return new ResponseDTO(
                httpStatusCode.StatusCodes.UNAUTHORIZED,
                null,
                new ErrorMessage("username or password is wrong")
            );
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
