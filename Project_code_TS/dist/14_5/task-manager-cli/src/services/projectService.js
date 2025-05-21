"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const logging_decorator_1 = require("../decorator/logging.decorator");
const Project_1 = require("../models/Project");
let ProjectService = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _createProject_decorators;
    let _getAllProjects_decorators;
    let _getProjectById_decorators;
    let _updateProject_decorators;
    let _deleteProject_decorators;
    return _a = class ProjectService {
            constructor(storageService) {
                this.storageService = __runInitializers(this, _instanceExtraInitializers);
                this.storageService = storageService;
            }
            createProject(name, description) {
                const data = this.storageService.loadData();
                const newProject = new Project_1.Project(name, description || '');
                data.projects.push(newProject);
                this.storageService.saveData(data);
                return newProject;
            }
            getAllProjects() {
                const data = this.storageService.loadData();
                return [...data.projects];
            }
            getProjectById(id) {
                if (!id?.trim())
                    return undefined;
                const data = this.storageService.loadData();
                let project = data.projects.find(p => p.id === id);
                if (!project) {
                    const matchingProjects = data.projects.filter(p => p.id.startsWith(id));
                    if (matchingProjects.length === 1) {
                        project = matchingProjects[0];
                    }
                    else if (matchingProjects.length > 1) {
                        console.warn(`Multiple projects found with prefix "${id}". Please use a more specific ID or full ID.`);
                        return undefined;
                    }
                }
                return project;
            }
            updateProject(id, updates) {
                const data = this.storageService.loadData();
                const projectToUpdate = this.getProjectById(id);
                if (!projectToUpdate) {
                    return undefined;
                }
                const projectIndex = data.projects.findIndex(p => p.id === projectToUpdate.id);
                if (projectIndex === -1)
                    return undefined;
                const projectInstance = data.projects[projectIndex];
                if (updates.name !== undefined) {
                    projectInstance.name = updates.name;
                }
                if (updates.description !== undefined) {
                    projectInstance.description = updates.description;
                }
                if (updates.status !== undefined) {
                    projectInstance.status = updates.status;
                }
                projectInstance.updatedAt = new Date();
                this.storageService.saveData(data);
                return projectInstance;
            }
            deleteProject(id) {
                const data = this.storageService.loadData();
                const projectToDelete = this.getProjectById(id);
                if (!projectToDelete) {
                    return false;
                }
                const initialProjectsLength = data.projects.length;
                data.projects = data.projects.filter(p => p.id !== projectToDelete.id);
                const initialTasksLength = data.tasks.length;
                data.tasks = data.tasks.filter(t => t.projectId !== projectToDelete.id);
                if (data.projects.length < initialProjectsLength || data.tasks.length < initialTasksLength) {
                    this.storageService.saveData(data);
                    return true;
                }
                return false;
            }
            getTasksForProject(projectId) {
                const project = this.getProjectById(projectId);
                if (!project) {
                    console.warn(`Project with ID "${projectId}" not found when trying to get its tasks.`);
                    return [];
                }
                const data = this.storageService.loadData();
                return data.tasks.filter(task => task.projectId === project.id);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createProject_decorators = [logging_decorator_1.LogMethodCalls];
            _getAllProjects_decorators = [logging_decorator_1.LogMethodCalls];
            _getProjectById_decorators = [logging_decorator_1.LogMethodCalls];
            _updateProject_decorators = [logging_decorator_1.LogMethodCalls];
            _deleteProject_decorators = [logging_decorator_1.LogMethodCalls];
            __esDecorate(_a, null, _createProject_decorators, { kind: "method", name: "createProject", static: false, private: false, access: { has: obj => "createProject" in obj, get: obj => obj.createProject }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getAllProjects_decorators, { kind: "method", name: "getAllProjects", static: false, private: false, access: { has: obj => "getAllProjects" in obj, get: obj => obj.getAllProjects }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getProjectById_decorators, { kind: "method", name: "getProjectById", static: false, private: false, access: { has: obj => "getProjectById" in obj, get: obj => obj.getProjectById }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateProject_decorators, { kind: "method", name: "updateProject", static: false, private: false, access: { has: obj => "updateProject" in obj, get: obj => obj.updateProject }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _deleteProject_decorators, { kind: "method", name: "deleteProject", static: false, private: false, access: { has: obj => "deleteProject" in obj, get: obj => obj.deleteProject }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProjectService = ProjectService;
