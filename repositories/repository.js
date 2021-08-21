const User = require("../models/users");
const Program = require("../models/programs");

class Repository {
    constructor() {}

    async addUserAndRole(registerRequestDTO) {
        const existingUsers = await User.find({
            username: registerRequestDTO["username"],
        }).exec();
        if (existingUsers.length === 0) {
            const newUser = await User.create(registerRequestDTO);
            return { ...newUser }._doc;
        } else {
            console.error(
                `ERROR when creating user. user with username: "${registerRequestDTO["username"]}" already exist!`
            );
            return undefined;
        }
    }

    async getUserByUsername(username) {
        const results = await User.find({ username }).exec();
        if (results.length === 0) {
            return undefined;
        }
        return results[0];
    }

    async getPastDonations(id) {
        const pastDonations = await Program.aggregate([
            { $unwind: "$donators" },
            { $match: { "donators.donator_id": id } },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    donated_amount: "$donators.donated_amount",
                },
            },
        ]);

        if (pastDonations.length === 0) {
            return undefined;
        }
        return pastDonations;
    }

    async getVerifiedPrograms() {
        const results = await Program.find({ isVerified: true })
            .select({ title: 1, collected_amount: 1 })
            .exec();
        if (results.length === 0) {
            return undefined;
        }
        return results;
    }

    async getProgramById(id) {
        const result = await Program.findById(id).exec();
        if (result === null) {
            return undefined;
        }
        return result;
    }

    async topupById(userId, amount) {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $inc: { balance: amount } },
            { new: true }
        ).exec();
        if (user === null) {
            return undefined;
        }
        return user;
    }

    async addProgram(title, description, id) {
        const newProgram = new Program({
            title,
            description,
            collected_amount: 0,
            fundraiser_id: id,
            isVerified: false,
        });
        await newProgram.save();
        return newProgram;
    }

    // TODO change to use transaction
    async donorProgram(userId, programId, amount) {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $inc: { balance: -amount } },
            { new: true }
        ).exec();

        const newDonator = {
            donator_id: userId,
            date: new Date(),
            donated_amount: amount,
        };
        const program = await Program.findOneAndUpdate(
            { _id: programId },
            {
                $push: { donators: newDonator },
                $inc: { collected_amount: amount },
            }
        ).exec();

        return true;
    }
}

module.exports = {
    Repository,
};
