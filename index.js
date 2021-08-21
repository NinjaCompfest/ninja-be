require("dotenv").config();

const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const {
    login,
    register,
    getProgramById,
    homepage,
    dashboard,
    topup,
    addProgram,
    donor,
} = require("./routes");
const { checkAuth } = require("./controllers/checkAuth");

//MongoDB Atlas Connection
connectDB();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.post("/register", register);
app.post("/login", login);

app.get("/homepage", checkAuth, homepage);
app.get("/dashboard", checkAuth, dashboard);

const programRouter = express.Router();
programRouter.get("/:id", getProgramById);
app.use("/programs", checkAuth)
app.use("/programs", programRouter);

const userRouter = express.Router();
userRouter.put("/:id/topup", topup);
userRouter.put("/:id/donor", donor);
app.use("/programs", checkAuth)
app.use("/users", userRouter);

app.post("/:id/programs", checkAuth, addProgram);

app.listen(process.env.PORT || port, () => {
    console.log(`ready - NINJA-BE is running on http://localhost:${port}`);
});
