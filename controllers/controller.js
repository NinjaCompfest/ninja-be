const httpStatusCode = require("http-status-codes");
const { LoginRequestDTO } = require("../dto/login");
const { RegisterRequestDTO } = require("../dto/register");

class Controller {
    constructor(manager) {
        this.manager = manager;
    }

    async register(req, res) {
        const body = req.body;
        const request = new RegisterRequestDTO(
            body.full_name,
            body.type,
            body.username,
            body.password
        );

        const response = await this.manager.register(request);
        if (response.statusCode !== httpStatusCode.StatusCodes.OK) {
            res.status(response.statusCode).json(response.errorMessage);
            return;
        }
        res.status(httpStatusCode.StatusCodes.OK).send(
            JSON.stringify(response.body)
        );
    }

    async login(req, res) {
        const body = req.body;
        const request = new LoginRequestDTO(body.username, body.password);

        const response = await this.manager.login(request);
        if (response.statusCode !== httpStatusCode.StatusCodes.OK) {
            res.status(response.statusCode).json(response.errorMessage);
            return;
        }
        res.status(httpStatusCode.StatusCodes.OK).send(
            JSON.stringify(response.body)
        );
    }
}

module.exports = {
    Controller,
};
