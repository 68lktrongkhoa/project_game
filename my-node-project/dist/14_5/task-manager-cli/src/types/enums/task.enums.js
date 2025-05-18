"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskType = exports.TaskPriority = exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["Open"] = "Open";
    TaskStatus["InProgress"] = "In Progress";
    TaskStatus["Resolved"] = "Resolved";
    TaskStatus["Closed"] = "Closed";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["Low"] = "Low";
    TaskPriority["Medium"] = "Medium";
    TaskPriority["High"] = "High";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var TaskType;
(function (TaskType) {
    TaskType["Task"] = "Task";
    TaskType["Bug"] = "Bug";
    TaskType["Request"] = "Request";
    TaskType["Enhancement"] = "Enhancement";
})(TaskType || (exports.TaskType = TaskType = {}));
