const httpStatusCode = require("http-status-codes");
const { LoginRequestDTO } = require("../dto/login");

class Controller {
    constructor(manager) {
        this.manager = manager;
    }

    async login(req, res) {
        const body = req.body;
        const request = new LoginRequestDTO(body.username, body.password);

        const response = await this.manager.login(request);
        console.log("response json", JSON.stringify(response.body));
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
