"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
// src/services/projectService.ts
const uuid_1 = require("uuid");
const types_1 = require("../types");
const storageService_1 = require("./storageService");
const createProject = (name, description) => {
    const data = (0, storageService_1.loadData)();
    const now = new Date().toISOString();
    const newProject = {
        id: (0, uuid_1.v4)(),
        name,
        description: description || undefined,
        status: types_1.ProjectStatus.Active,
        createdAt: now,
        updatedAt: now,
    };
    data.projects.push(newProject);
    (0, storageService_1.saveData)(data);
    return newProject;
};
exports.createProject = createProject;
const getAllProjects = () => {
    const data = (0, storageService_1.loadData)();
    return data.projects;
};
exports.getAllProjects = getAllProjects;
const getProjectById = (id) => {
    if (!id)
        return undefined;
    const data = (0, storageService_1.loadData)();
    let project = data.projects.find(p => p.id === id);
    if (!project) {
        project = data.projects.find(p => p.id.startsWith(id));
    }
    return project;
};
exports.getProjectById = getProjectById;
const updateProject = (id, updates) => {
    const data = (0, storageService_1.loadData)();
    const projectIndex = data.projects.findIndex(p => p.id === id);
    if (projectIndex === -1)
        return undefined;
    if (updates.description === '') {
        updates.description = undefined;
    }
    data.projects[projectIndex] = {
        ...data.projects[projectIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    (0, storageService_1.saveData)(data);
    return data.projects[projectIndex];
};
exports.updateProject = updateProject;
const deleteProject = (id) => {
    const data = (0, storageService_1.loadData)();
    const projectToDelete = (0, exports.getProjectById)(id);
    if (!projectToDelete)
        return false;
    const initialProjectsLength = data.projects.length;
    // Xóa dự án
    data.projects = data.projects.filter(p => p.id !== projectToDelete.id);
    const initialTasksLength = data.tasks.length;
    data.tasks = data.tasks.filter(t => t.projectId !== projectToDelete.id);
    if (data.projects.length < initialProjectsLength || data.tasks.length < initialTasksLength) {
        (0, storageService_1.saveData)(data);
        return true;
    }
    return false;
};
exports.deleteProject = deleteProject;
