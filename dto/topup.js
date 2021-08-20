class TopupRequestDTO {
    constructor(userId, amount) {
        this.userId = userId;
        this.amount = amount;
    }
}

module.exports = {
    TopupRequestDTO,
};
