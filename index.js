require("dotenv").config();

const connectDB = require("./config/db");

const express = require("express");
const cors = require('cors')
const bodyParser = require("body-parser");

const { login, register, getProgramById, homepage } = require("./routes");
const { checkAuth } = require("./controllers/checkAuth");

//MongoDB Atlas Connection
connectDB();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(bodyParser.json());

app.post("/register", register);
app.post("/login", login);

app.get("/homepage", checkAuth, homepage);

const programRouter = express.Router();
programRouter.get("/:id", getProgramById);
// app.use("/programs", checkAuth)
app.use("/programs", programRouter);



app.listen(process.env.PORT || port, () => {
    console.log(`ready - NINJA-BE is running on http://localhost:${port}`);
});
