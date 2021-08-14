const users = require("../models/users");

class Repository {
    constructor() {}
    getUserByUsername(username) {
        return users.User.find({ username });
    }
}
