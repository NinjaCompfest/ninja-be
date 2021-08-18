class LoginRequestDTO {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

class LoginResponseDTO {
    constructor(user, token) {
        this.user = user;
        this.token = token;
    }
}

module.exports = {
    LoginRequestDTO,
    LoginResponseDTO,
};
