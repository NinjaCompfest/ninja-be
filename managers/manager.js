const httpStatusCode = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ResponseDTO, ErrorMessage } = require("../dto/response");
const { LoginResponseDTO } = require("../dto/login");
const {
    NotifRequestDTO,
    FundraiseNotif,
    ProgramsNotif,
    WithdrawalNotif,
} = require("../dto/notification");

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
                new ErrorMessage(
                    "failed to register, perhaps the user already exist"
                ),
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
            const newNotif = new FundraiseNotif(
                "FUNDRAISE",
                newUser._id,
                newUser.username,
                newUser.full_name
            );
            const response = this.repository.addNotification(newNotif);
            if (response === null || response === undefined) {
                return new ResponseDTO(
                    httpStatusCode.StatusCodes.NOT_FOUND,
                    null,
                    new ErrorMessage("failed to notify admin")
                );
            }
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
                httpStatusCode.StatusCodes.BAD_REQUEST,
                null,
                new ErrorMessage("user not found")
            );
        }
        if (user.role === "FUNDRAISER" && !user.isVerified) {
            return new ResponseDTO(
                httpStatusCode.StatusCodes.BAD_REQUEST,
                null,
                new ErrorMessage("waiting for admin")
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
        user.balance = undefined;
        user.isVerified = undefined;
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

    async getUserIdentity(username) {
        const user = await this.repository.getUserByUsername(username);
        if (user === null || user === undefined) {
            return new ResponseDTO(
                httpStatusCode.StatusCodes.OK,
                null,
                new ErrorMessage("user not found")
            );
        }
        return new ResponseDTO(httpStatusCode.StatusCodes.OK, user, null);
    }

    async getVerifiedPrograms(request) {
        switch (request.user.role) {
            case "FUNDRAISER":
                const myPrograms =
                    await this.repository.getProgramByFundraiserId(
                        request.user._id
                    );

                if (myPrograms === null || myPrograms === undefined) {
                    return new ResponseDTO(
                        httpStatusCode.StatusCodes.OK,
                        null,
                        new ErrorMessage("There is no programs found")
                    );
                }

                return new ResponseDTO(
                    httpStatusCode.StatusCodes.OK,
                    myPrograms,
                    null
                );

            case "DONOR":
                const verifiedPrograms =
                    await this.repository.getVerifiedPrograms();
                if (
                    verifiedPrograms === null ||
                    verifiedPrograms === undefined
                ) {
                    return new ResponseDTO(
                        httpStatusCode.StatusCodes.OK,
                        null,
                        new ErrorMessage("There is no verified Programs found")
                    );
                }

            default:
                return new ResponseDTO(
                    httpStatusCode.StatusCodes.OK,
                    verifiedPrograms,
                    null
                );
        }
    }

    async withdrawById(request) {
        const { userId, programId, amount } = request;
        const withdrawedProgram = await this.repository.withdrawById(
            userId,
            programId,
            amount
        );

        if (withdrawedProgram === null || withdrawedProgram === undefined) {
            return new ResponseDTO(
                httpStatusCode.StatusCodes.NOT_FOUND,
                null,
                new ErrorMessage("withdraw failed!")
            );
        }

        return new ResponseDTO(
            httpStatusCode.StatusCodes.OK,
            withdrawedProgram,
            null
        );
    }

    async dashboard(request) {
        switch (request.user.user.role) {
            case "DONOR":
                const myPastDonations = await this.repository.getPastDonations(
                    request.user.user._id
                );

                if (myPastDonations === null || myPastDonations === undefined) {
                    return new ResponseDTO(
                        httpStatusCode.StatusCodes.OK,
                        null,
                        new ErrorMessage("There is no past donations found")
                    );
                }

                return new ResponseDTO(
                    httpStatusCode.StatusCodes.OK,
                    myPastDonations,
                    null
                );

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
        const updatedUser = await this.repository.topupById(
            request.userId,
            request.amount
        );
        if (updatedUser === null || updatedUser === undefined) {
            return new ResponseDTO(
                httpStatusCode.StatusCodes.NOT_FOUND,
                null,
                new ErrorMessage("topup failed")
            );
        }

        return new ResponseDTO(
            httpStatusCode.StatusCodes.OK,
            updatedUser,
            null
        );
    }

    async addProgram(request) {
        const { title, description, id, full_name } = request;
        const newProgram = await this.repository.addProgram(
            title,
            description,
            id
        );
        const newNotif = new ProgramsNotif(
            "PROGRAM",
            newProgram._id,
            newProgram._id,
            title,
            full_name
        );
        const response = await this.repository.addNotification(newNotif);

        return new ResponseDTO(httpStatusCode.StatusCodes.OK, newProgram, null);
    }

    async donor(request) {
        const updatedUser = await this.repository.donorProgram(
            request.userId,
            request.programId,
            request.amount
        );
        if (updatedUser === null || updatedUser === undefined) {
            return new ResponseDTO(
                httpStatusCode.StatusCodes.NOT_FOUND,
                null,
                new ErrorMessage("donor failed")
            );
        }
        return new ResponseDTO(
            httpStatusCode.StatusCodes.OK,
            updatedUser,
            null
        );
    }

    async getAllNotifications() {
        const notifications = await this.repository.getAllNotifications();
        if (notifications === null || notifications === undefined) {
            return new ResponseDTO(
                httpStatusCode.StatusCodes.NOT_FOUND,
                null,
                new ErrorMessage("failed to get all notifications")
            );
        }
        return new ResponseDTO(
            httpStatusCode.StatusCodes.OK,
            notifications,
            null
        );
    }

    async respondToNotification(request) {
        const { id, notifId, type, isAccepted } = request;
        // TODO check authorization with id

        switch (type) {
            case "WITHDRAWAL":
                if (isAccepted) {
                    const result = await this.repository.respondWithdrawal(
                        notifId
                    );
                    if (result === null || result === undefined) {
                        return new ResponseDTO(
                            httpStatusCode.StatusCodes.NOT_FOUND,
                            null,
                            new ErrorMessage("failed to respond notifications")
                        );
                    }
                    const deletedNotification =
                        await this.repository.deleteNotificationById(notifId);

                    return new ResponseDTO(
                        httpStatusCode.StatusCodes.OK,
                        result,
                        null
                    );
                } else {
                    const deletedNotification =
                        await this.repository.deleteNotificationById(notifId);
                    return new ResponseDTO(
                        httpStatusCode.StatusCodes.OK,
                        deletedNotification,
                        null
                    );
                }

            case "FUNDRAISE":
                if (isAccepted) {
                    const result = await this.repository.respondFundraise(
                        notifId
                    );
                    if (result === null || result === undefined) {
                        return new ResponseDTO(
                            httpStatusCode.StatusCodes.NOT_FOUND,
                            null,
                            new ErrorMessage("failed to respond notifications")
                        );
                    }
                    const deletedNotification =
                        await this.repository.deleteNotificationById(notifId);

                    return new ResponseDTO(
                        httpStatusCode.StatusCodes.OK,
                        result,
                        null
                    );
                } else {
                    const deletedNotification =
                        await this.repository.deleteNotificationById(notifId);
                    return new ResponseDTO(
                        httpStatusCode.StatusCodes.OK,
                        deletedNotification,
                        null
                    );
                }

            case "PROGRAM":
                if (isAccepted) {
                    const result = await this.repository.respondProgram(
                        notifId
                    );
                    if (result === null || result === undefined) {
                        return new ResponseDTO(
                            httpStatusCode.StatusCodes.NOT_FOUND,
                            null,
                            new ErrorMessage("failed to respond notifications")
                        );
                    }
                    const deletedNotification =
                        await this.repository.deleteNotificationById(notifId);

                    return new ResponseDTO(
                        httpStatusCode.StatusCodes.OK,
                        result,
                        null
                    );
                } else {
                    const deletedNotification =
                        await this.repository.deleteNotificationById(notifId);
                    return new ResponseDTO(
                        httpStatusCode.StatusCodes.OK,
                        deletedNotification,
                        null
                    );
                }
            default:
                return new ResponseDTO(
                    httpStatusCode.StatusCodes.OK,
                    new ErrorMessage("wrong body format!"),
                    null
                );
        }
    }
}

module.exports = {
    Manager,
};
