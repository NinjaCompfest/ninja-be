const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
    donator_id: {
        type: Schema.Types.ObjectId,
        ref: "Donation", //refer to the Donation model
    },
    program_id: {
        type: Schema.Types.ObjectId,
        ref: "Program", //refer to the Program model
    },
});

module.exports = mongoose.model("Donation", donationSchema);
