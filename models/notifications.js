const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    new_fundraiser: {
        type: Schema.Types.ObjectId,
        ref: "User", //refer to the User model
    },
    new_withdrawal_request: {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User", //refer to the User model
        },
        amount: {
            type: Number,
        },
    },
    new_program: {
        type: Schema.Types.ObjectId,
        ref: "Program", //refer to the Program model
    },
});

module.exports = mongoose.model("Notification", notificationSchema);
