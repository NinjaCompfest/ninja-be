class DonorRequestDTO {
    constructor(userId, programId, amount){
        this.userId = userId;
        this.programId = programId;
        this.amount = amount;
    }
}

module.exports = {
    DonorRequestDTO
}