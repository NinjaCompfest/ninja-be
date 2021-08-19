const { Repository } = require("./repositories/repository");
const { Manager } = require("./managers/manager");
const { Controller } = require("./controllers/controller");

const repository = new Repository();
const manager = new Manager(repository);
const controller = new Controller(manager);

async function register(req, res) {
    console.info("POST - /register");
    await controller.register(req, res);
}
async function login(req, res) {
    console.info("POST - /login");
    await controller.login(req, res);
}

async function homepage(req, res) {
    console.info("GET - /homepage");
    await controller.homepage(req, res);
}

async function getProgramById(req, res) {
    console.info(`GET - /programs/${req.params.id}`);
    await controller.getProgramById(req, res);
}

module.exports = {
    register,
    login,
    homepage,
    getProgramById,
};
