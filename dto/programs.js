class ProgramsRequestDTO {
    constructor(id) {
        this.id = id;
    }
}

class AddProgramRequestDTO {
    constructor(title, description, id) {
        this.title = title;
        this.description = description;
        this.id = id;
    }
}

module.exports = {
    ProgramsRequestDTO,
    AddProgramRequestDTO,
};
