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

    async homepage(request) {
        switch (request.user.user.role) {
            case "DONOR":
                const verifiedPrograms =
                    await this.repository.getVerifiedPrograms();
                if (
                    verifiedPrograms === null ||
                    verifiedPrograms === undefined
                ) {
                    return new ResponseDTO(
                        httpStatusCode.StatusCodes.NOT_FOUND,
                        null,
                        new ErrorMessage("There is no verified Programs found")
                    );
                }

                return new ResponseDTO(
                    httpStatusCode.StatusCodes.OK,
                    verifiedPrograms,
                    null
                );

            // case "FUNDRAISER":
            //     break;

            default:
                return new ResponseDTO(
                    httpStatusCode.StatusCodes.NOT_FOUND,
                    null,
                    new ErrorMessage("There is no verified Programs found")
                );
        }
    }

    async dashboard(request) {
        switch (request.user.user.role) {
            case "DONOR":
                const myPastDonations = await this.repository.getPastDonations(
                    request.user.user._id
                );

                if (myPastDonations === null || myPastDonations === undefined) {
                    return new ResponseDTO(
                        httpStatusCode.StatusCodes.NOT_FOUND,
                        null,
                        new ErrorMessage("There is no past donations found")
                    );
                }

                return new ResponseDTO(
                    httpStatusCode.StatusCodes.OK,
                    myPastDonations,
                    null
                );

            case "FUNDRAISER":
                break;

            default:
                return new ResponseDTO(
                    httpStatusCode.StatusCodes.NOT_FOUND,
                    null,
                    new ErrorMessage("There is no past donations found")
                );
        }
    }

    async getProgramById(request) {
        const programs = await this.repository.getProgramById(request.id);
        if (programs === null || programs === undefined) {
            return new ResponseDTO(
                httpStatusCode.StatusCodes.NOT_FOUND,
                null,
                new ErrorMessage("program not found")
            );
        }

        return new ResponseDTO(httpStatusCode.StatusCodes.OK, programs, null);
    }

    async topup(request) {
        const newBalance = await this.repository.topupById(
            request.userId,
            request.amount
        );
        if (newBalance === null || newBalance === undefined) {
            return new ResponseDTO(
                httpStatusCode.StatusCodes.NOT_FOUND,
                null,
                new ErrorMessage("topup failed")
            );
        }

        return new ResponseDTO(httpStatusCode.StatusCodes.OK, null, null);
    }

    async addProgram(request) {
        const { title, description, id } = request;
        const newProgram = await this.repository.addProgram(
            title,
            description,
            id
        );
        return new ResponseDTO(httpStatusCode.StatusCodes.OK, newProgram, null);
    }
}

module.exports = {
    Manager,
};
