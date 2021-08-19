const users = require("../models/users");

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
}

module.exports = {
    Repository,
};
