class NotifRequestDTO {
    constructor(id, notifId, type, isAccepted) {
        this.id = id;
        this.notifId = notifId;
        this.type = type;
        this.isAccepted = isAccepted;
    }
}

class FundraiseNotif {
    constructor(type, type_id, username, full_name) {
        this.type = type;
        this.type_id = type_id;
        this.username = username;
        this.full_name = full_name;
    }
}

class ProgramsNotif {
    constructor(type, type_id, program_id, program_name, fundraiser_name) {
        this.type = type;
        this.type_id = type_id;
        this.program_id = program_id;
        this.program_name = program_name;
        this.fundraiser_name = fundraiser_name;
    }
}

class WithdrawalNotif {
    constructor(type, type_id, program_id, amount, program_name) {
        this.type = type;
        this.type_id = type_id;
        this.program_id = program_id;
        this.amount = amount;
        this.program_name = program_name;
    }
}

module.exports = {
    NotifRequestDTO,
    FundraiseNotif,
    ProgramsNotif,
    WithdrawalNotif,
};
