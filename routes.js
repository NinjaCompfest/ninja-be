const { Repository } = require("./repositories/repository");
const { Manager } = require("./managers/manager");
const { Controller } = require("./controllers/controller");

const repository = new Repository();
const manager = new Manager(repository);
const controller = new Controller(manager);

async function register(req, res){
    console.info("POST - /register")
    await controller.register(req, res)
}
async function login(req, res) {
    console.info("POST - /login")
    await controller.login(req, res);
}

module.exports = {
    register,
    login
}