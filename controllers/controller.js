const httpStatusCode = require("http-status-codes");
const { LoginRequestDTO } = require("../dto/login");
const { RegisterRequestDTO } = require("../dto/register");
const { HomepageRequestDTO } = require("../dto/homepage");
const { DashboardRequestDTO } = require("../dto/dashboard");
const { ProgramsRequestDTO } = require("../dto/programs");

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

    async homepage(req, res) {
        const request = new HomepageRequestDTO(req.user);
        const response = await this.manager.homepage(request);
        if (response.statusCode !== httpStatusCode.StatusCodes.OK) {
            res.status(response.statusCode).json(response.errorMessage);
            return;
        }
        res.status(httpStatusCode.StatusCodes.OK).send(
            JSON.stringify(response.body)
        );
    }

    async dashboard(req, res) {
        const request = new DashboardRequestDTO(req.user);
        const response = await this.manager.dashboard(request);
        if (response.statusCode !== httpStatusCode.StatusCodes.OK) {
            res.status(response.statusCode).json(response.errorMessage);
            return;
        }
        res.status(httpStatusCode.StatusCodes.OK).send(
            JSON.stringify(response.body)
        );
    }

    // programs
    async getProgramById(req, res) {
        const request = new ProgramsRequestDTO(req.params.id);
        const response = await this.manager.getProgramById(request);
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
