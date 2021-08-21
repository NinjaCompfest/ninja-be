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
    donators: [
        {
            donator_id: String,
            date: Date,
            donated_amount: {
                type: Number,
                required: true,
            },
        },
    ],
    isVerified: {
        type: Boolean,
        required: true,
    },
});

module.exports = mongoose.model("Program", programsSchema);
