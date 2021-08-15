class LoginRequestDTO {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

class LoginResponseDTO {
    constructor(token) {
        this.token = token;
    }
}

module.exports = {
    LoginRequestDTO,
    LoginResponseDTO
}