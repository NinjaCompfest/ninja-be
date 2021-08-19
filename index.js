require("dotenv").config();

const connectDB = require("./config/db");

const express = require("express");
const bodyParser =require("body-parser")

const { login, register } = require("./routes");

//MongoDB Atlas Connection
connectDB();

const app = express();
const port = 3000;

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

app.post("/register", register)
app.post("/login", login);

app.listen(process.env.PORT || port, () => {
    console.log(`ready - NINJA-BE is running on http://localhost:${port}`);
})
