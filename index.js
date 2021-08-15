require("dotenv").config();

const connectDB = require("./config/db");

const express = require("express");

const { login } = require("./routes");

//MongoDB Atlas Connection
connectDB();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.post("/login", login);

app.listen(port, () => {
    console.log(`NINJA-BE is running on port: ${port}`);
});
