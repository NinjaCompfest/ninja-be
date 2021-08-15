const { Repository } = require("./repositories/repository");
const { Manager } = require("./managers/manager");
const { Controller } = require("./controllers/controller");

const express = require("express");
const app = express();
const port = 3000;

const repository = new Repository();
const manager = new Manager(repository);
const controller = new Controller(manager);

app.post("/login", controller.login);

app.listen(port, () => {
    console.log(`NINJA-BE is running on port: ${port}`);
});
