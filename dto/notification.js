class NotifRequestDTO {
    constructor(id, notifId, type, isAccepted) {
        this.id = id;
        this.notifId = notifId;
        this.type = type;
        this.isAccepted = isAccepted;
    }
}

module.exports = {
    NotifRequestDTO,
};
