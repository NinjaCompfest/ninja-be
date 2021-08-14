const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const programsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    collected_amount: {
        type: Number,
        required: true,
    },
    fundraiser_id: {
        type: Schema.Types.ObjectId,
        ref: "User", //refer to the User model
    },
    donators_id: [
        {
            type: Schema.Types.ObjectId,
            ref: "User", //refer to the User model
        },
    ],
    isVerified: {
        type: Boolean,
        required: true,
    },
});

module.exports = mongoose.model("Program", programsSchema);
