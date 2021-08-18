const users = require("../models/users");

class Repository {
    constructor() {}
    async getUserByUsername(username) {
        const results = await users.find({}).exec();
        console.log("results",results)
        // const results = await users.find({ username }).exec();
        if (results === []){
            return undefined
        }
        return results[0]
    }
}

module.exports = {
    Repository
}