const users = require("../models/users");
const programs = require("../models/programs");

class Repository {
    constructor() {}

    async addUserAndRole(registerRequestDTO) {
        const existingUsers = await users
            .find({ username: registerRequestDTO["username"] })
            .exec();
        if (existingUsers.length === 0) {
            const newUser = await users.create(registerRequestDTO);
            return { ...newUser }._doc;
        } else {
            console.error(
                `ERROR when creating user. user with username: "${registerRequestDTO["username"]}" already exist!`
            );
            return undefined;
        }
    }

    async getUserByUsername(username) {
        const results = await users.find({ username }).exec();
        if (results.length === 0) {
            return undefined;
        }
        return results[0];
    }

    async getPastDonations(id) {
        const pastDonations = await programs.aggregate([
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

    // Programs
    async getVerifiedPrograms() {
        const results = await programs
            .find({ isVerified: true })
            .select({ _id: 0, title: 1, collected_amount: 1 })
            .exec();
        if (results.length === 0) {
            return undefined;
        }
        return results;
    }

    async getProgramById(id) {
        const result = await programs.findById(id).exec();
        if (result === null) {
            return undefined;
        }
        return result;
    }
}

module.exports = {
    Repository,
};
