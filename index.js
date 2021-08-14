const r = require("./repositories/repository");
const m = require("./managers/manager");
const c = require("./controllers/controller");

const express = require("express");
const app = express();
const port = 3000;

const repository = new r.Repository();
const manager = new m.Manager(repository);
const controller = new c.Controller(manager);

app.post("/login", controller.login);

app.listen(port, () => {
    console.log(`NINJA-BE is running`);
});
