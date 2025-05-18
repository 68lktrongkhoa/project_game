"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const uuid_1 = require("uuid");
const task_enums_1 = require("../types/enums/task.enums");
class Task {
    constructor(projectId, title, description = '', priority = task_enums_1.TaskPriority.Medium, type = task_enums_1.TaskType.Task, id, status, assignee, deadline, createdAt, updatedAt) {
        this.id = id || (0, uuid_1.v4)();
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.status = status || task_enums_1.TaskStatus.Open;
        this.priority = priority;
        this.type = type;
        this.assignee = assignee;
        this.deadline = deadline;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }
    static fromPlainObject(obj) {
        return new Task(obj.projectId, obj.title, obj.description, obj.priority, obj.type, obj.id, obj.status, obj.assignee, obj.deadline ? new Date(obj.deadline) : undefined, obj.createdAt ? new Date(obj.createdAt) : undefined, obj.updatedAt ? new Date(obj.updatedAt) : undefined);
    }
}
exports.Task = Task;
