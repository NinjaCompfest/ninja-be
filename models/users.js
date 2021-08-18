const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "donator", "fundraiser"],
    },
    balance: {
        type: Number,
    },
    isVerified: {
        type: Boolean,
    },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
