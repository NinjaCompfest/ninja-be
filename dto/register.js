class RegisterRequestDTO {
    constructor(full_name, type, username, password) {
        this.full_name = full_name;
        this.role = type;
        this.username = username;
        this.password = password;
        this.balance = 0;
        this.isVerified = false;
    }
}

module.exports = {
    RegisterRequestDTO,
};
