const { Repository } = require("./repositories/repository");
const { Manager } = require("./managers/manager");
const { Controller } = require("./controllers/controller");

const repository = new Repository();
const manager = new Manager(repository);
const controller = new Controller(manager);

async function login(req, res) {
    await controller.login(req, res);
}

module.exports = {
    login
}