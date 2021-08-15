const httpStatusCode = require("http-status-codes");
const login = require("../dto/login");

class Controller {
    constructor(manager) {
        this.manager = manager;
    }

    login(req, res) {
        const body = JSON.parse(req.body);
        const request = new login.LoginRequestDTO(body.username, body.password);

        const response = this.manager.login(request);

        if (response != httpStatusCode.StatusCode.OK) {
            res.status(response.statusCode).json(response.errorMessage);
            return;
        }

        res.json(response.body);
    }
}

module.exports = {
    Controller,
};
