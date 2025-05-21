"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
// src/models/Project.ts
const uuid_1 = require("uuid");
const project_enums_1 = require("../types/enums/project.enums");
class Project {
    constructor(name, description = '', id, status, createdAt, updatedAt) {
        this.id = id || (0, uuid_1.v4)();
        this.name = name;
        this.description = description;
        this.status = status || project_enums_1.ProjectStatus.Active;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.tasks = [];
    }
    updateDetails(name, description) {
        this.name = name;
        this.description = description;
        this.updatedAt = new Date();
    }
    updateStatus(status) {
        this.status = status;
        this.updatedAt = new Date();
    }
    static fromPlainObject(obj) {
        const project = new Project(obj.name, obj.description, obj.id, obj.status, obj.createdAt ? new Date(obj.createdAt) : undefined, obj.updatedAt ? new Date(obj.updatedAt) : undefined);
        return project;
    }
}
exports.Project = Project;
