"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const uuid_1 = require("uuid");
const types_1 = require("../types");
const storageService_1 = require("./storageService");
const projectService_1 = require("./projectService");
const createTask = (input) => {
    const data = (0, storageService_1.loadData)();
    const project = (0, projectService_1.getProjectById)(input.projectId);
    if (!project) {
        console.error(`Project with ID (or prefix) "${input.projectId}" not found.`);
        return null;
    }
    const now = new Date().toISOString();
    const newTask = {
        id: (0, uuid_1.v4)(),
        projectId: project.id,
        title: input.title,
        description: input.description || undefined,
        priority: input.priority,
        deadline: input.deadline || undefined,
        assignee: input.assignee || undefined,
        type: input.type,
        status: types_1.TaskStatus.Open,
        createdAt: now,
        updatedAt: now,
    };
    data.tasks.push(newTask);
    (0, storageService_1.saveData)(data);
    return newTask;
};
exports.createTask = createTask;
const getAllTasks = (projectId) => {
    const data = (0, storageService_1.loadData)();
    if (projectId) {
        const project = (0, projectService_1.getProjectById)(projectId);
        return project ? data.tasks.filter(t => t.projectId === project.id) : [];
    }
    return data.tasks;
};
exports.getAllTasks = getAllTasks;
const getTaskById = (id) => {
    if (!id)
        return undefined;
    const data = (0, storageService_1.loadData)();
    let task = data.tasks.find(t => t.id === id);
    if (!task) {
        task = data.tasks.find(t => t.id.startsWith(id));
    }
    return task;
};
exports.getTaskById = getTaskById;
const updateTask = (id, updates) => {
    const data = (0, storageService_1.loadData)();
    const taskIndex = data.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1)
        return undefined;
    if (updates.description === '')
        updates.description = undefined;
    if (updates.assignee === '')
        updates.assignee = undefined;
    if (updates.deadline === '')
        updates.deadline = undefined;
    data.tasks[taskIndex] = {
        ...data.tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    (0, storageService_1.saveData)(data);
    return data.tasks[taskIndex];
};
exports.updateTask = updateTask;
const deleteTask = (id) => {
    const data = (0, storageService_1.loadData)();
    const taskToDelete = (0, exports.getTaskById)(id);
    if (!taskToDelete)
        return false;
    const initialLength = data.tasks.length;
    data.tasks = data.tasks.filter(t => t.id !== taskToDelete.id);
    if (data.tasks.length < initialLength) {
        (0, storageService_1.saveData)(data);
        return true;
    }
    return false;
};
exports.deleteTask = deleteTask;
