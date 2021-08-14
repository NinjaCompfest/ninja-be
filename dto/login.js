class LoginRequestDTO {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

class LoginReponseDTO {
    constructor(token) {
        this.token = token;
    }
}
