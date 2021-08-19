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
        if (results === []) {
            return undefined;
        }
        return results[0];
    }

    async getVerifiedPrograms() {
        const results = await programs.find({ isVerified: true }).exec();
        if (results === []) {
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
