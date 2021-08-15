const httpStatusCode = require("http-status-codes");
const { LoginRequestDTO } = require("../dto/login");

class Controller {
    constructor(manager) {
        this.manager = manager;
    }

    async login(req, res) {
        console.info("/login[POST]", req.body);
        const body = req.body;
        const request = new LoginRequestDTO(body.username, body.password);

        const response = await this.manager.login(request);
        if (response != httpStatusCode.StatusCodes.OK) {
            res.status(response.statusCode).json(response.errorMessage);
            return;
        }
        res.json(response.body);
    }
}

module.exports = {
    Controller,
};
