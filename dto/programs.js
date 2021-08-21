class ProgramsRequestDTO {
    constructor(id) {
        this.id = id;
    }
}

class AddProgramRequestDTO {
    constructor(title, description, id, full_name) {
        this.title = title;
        this.description = description;
        this.id = id;
        this.full_name = full_name
    }
}

class WithdrawRequestDTO {
    constructor(userId, programId, amount) {
        this.userId = userId;
        this.programId = programId;
        this.amount = amount;
    }
}

module.exports = {
    ProgramsRequestDTO,
    AddProgramRequestDTO,
    WithdrawRequestDTO,
};
