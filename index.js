require("dotenv").config();

const { Repository } = require("./repositories/repository");
const { Manager } = require("./managers/manager");
const { Controller } = require("./controllers/controller");
const connectDB = require("./config/db");

// Models
const Program = require("./models/programs");
const Donation = require("./models/donations");
const Notification = require("./models/notifications");
const User = require("./models/users");

const express = require("express");

//MongoDB Atlas Connection
connectDB();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

const repository = new Repository();
const manager = new Manager(repository);
const controller = new Controller(manager);

function login(req, res) {
    controller.login(req, res);
}
app.post("/login", login);

// fundraiser create program
app.post("/:id/programs", async (req, res) => {
    const { id } = req.params; //fundraiser (USER) id

    const { title, description } = req.body;

    const newProgram = new Program({
        title,
        description,
        collected_amount: 0,
        fundraiser_id: id,
        isVerified: false,
    });

    await newProgram.save();

    res.send(newProgram);
    // res.redirect("/")
});

app.listen(port, () => {
    console.log(`NINJA-BE is running on port: ${port}`);
});
