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

async function dashboard(req, res) {
    console.info("GET - /dashboard");
    await controller.dashboard(req, res);
}

async function getVerifiedPrograms(req, res) {
    console.info("GET - /programs");
    await controller.getVerifiedPrograms(req, res);
}
async function getProgramById(req, res) {
    console.info(`GET - /programs/${req.params.id}`);
    await controller.getProgramById(req, res);
}
async function withdrawById(req, res) {
    console.info(
        `PUT - /fundraisers/${req.params.userId}/programs/${req.params.programId}/withdraw`
    );
    await controller.withdrawById(req, res);
}

async function getUserIdentity(req, res) {
    console.info(`GET - /users`);
    await controller.getUserIdentity(req, res);
}
async function topup(req, res) {
    console.info(`PUT - /users/${req.params.id}/topup`);
    await controller.topup(req, res);
}
async function donor(req, res) {
    console.info(`PUT - /users/${req.params.id}/donor`);
    await controller.donor(req, res);
}

async function addProgram(req, res) {
    console.info(`POST - /fundraisers/${req.params.id}/programs`);
    await controller.addProgram(req, res);
}

async function getAllNotifications(req, res) {
    console.info(`GET - /admins/${req.params.id}/notifications`);
    await controller.getAllNotifications(req, res);
}

async function respondToNotification(req, res) {
    console.info(`PUT - /admins/${req.params.id}/notifications/${req.params.notifId}`);
    await controller.respondToNotification(req, res);
}

module.exports = {
    register,
    login,
    dashboard,
    getVerifiedPrograms,
    getProgramById,
    withdrawById,
    getUserIdentity,
    topup,
    donor,
    addProgram,
    getAllNotifications,
    respondToNotification,
};
