const httpStatusCode = require("http-status-codes");
const { LoginRequestDTO } = require("../dto/login");

class Controller {
    constructor(manager) {
        this.manager = manager;
    }

    login(req, res) {
        console.info("/login[POST]", req.body);
        const body = req.body;
        const request = new LoginRequestDTO(body.username, body.password);

        console.log("ss", this);
        const response = this.manager.login(request);

        // if (response != httpStatusCode.StatusCode.OK) {
        //     res.status(response.statusCode).json(response.errorMessage);
        //     return;
        // }
        res.status(200);
        // res.json(response.body);
    }
}

module.exports = {
    Controller,
};
