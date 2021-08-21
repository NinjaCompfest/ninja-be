class UsersResponseDTO {
    constructor(full_name, username, balance) {
        this.full_name = full_name;
        this.username = username;
        this.balance = balance;
    }
}

module.exports = {
    UsersResponseDTO,
};
