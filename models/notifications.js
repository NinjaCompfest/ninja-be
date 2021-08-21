const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ["WITHDRAWAL", "FUNDRAISE", "PROGRAM"],
    },
    type_id: { type: String, required: true },
    amount: Number,
});

module.exports = mongoose.model("Notification", notificationSchema);
