const mongoose = require("mongoose");

const connectDB = () => {
    /* check if we already have connection to mongodb */
    if (mongoose.connection.readyState) {
        return;
    } else {
        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
    }

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.log("Mongo Database Atlas connected");
    });
};
module.exports = connectDB;
