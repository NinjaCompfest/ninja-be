require("dotenv").config();

const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const {
    login,
    register,
    getVerifiedPrograms,
    getProgramById,
    withdrawById,
    dashboard,
    getUserIdentity,
    topup,
    donor,
    addProgram,
    getAllNotifications,
    respondToNotification
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

app.get("/dashboard", checkAuth, dashboard);

const programRouter = express.Router();
programRouter.get("/", getVerifiedPrograms);
programRouter.get("/:id", getProgramById);
app.use("/programs", checkAuth);
app.use("/programs", programRouter);

const userRouter = express.Router();
userRouter.get("/", getUserIdentity);
userRouter.put("/:id/topup", topup);
userRouter.put("/:id/donor", donor);
app.use("/users", checkAuth);
app.use("/users", userRouter);

const fundraiserRouter = express.Router();
fundraiserRouter.post("/:id/programs", addProgram)
fundraiserRouter.get("/:id/programs", getVerifiedPrograms)
fundraiserRouter.get("/:userId/programs/:programId", getProgramById)
fundraiserRouter.put("/:userId/programs/:programId/withdraw", withdrawById)
app.use("/fundraisers/", checkAuth);
app.use("/fundraisers/", fundraiserRouter);

const adminRouter = express.Router();
adminRouter.get("/:id/notifications", getAllNotifications)
adminRouter.put("/:id/notifications/:notifId", respondToNotification)
app.use("/admins/", checkAuth)
app.use("/admins/", adminRouter)

app.listen(process.env.PORT || port, () => {
    console.log(`ready - NINJA-BE is running on http://localhost:${port}`);
});
