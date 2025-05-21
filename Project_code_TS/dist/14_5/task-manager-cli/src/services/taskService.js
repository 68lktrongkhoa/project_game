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
exports.TaskService = void 0;
const Task_1 = require("../models/Task");
const logging_decorator_1 = require("../decorator/logging.decorator");
let TaskService = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _createTask_decorators;
    let _getAllTasks_decorators;
    let _getTaskById_decorators;
    let _updateTask_decorators;
    return _a = class TaskService {
            constructor(storageService, projectService) {
                this.storageService = __runInitializers(this, _instanceExtraInitializers);
                this.storageService = storageService;
                this.projectService = projectService;
            }
            createTask(input) {
                const data = this.storageService.loadData();
                const project = this.projectService.getProjectById(input.projectId);
                if (!project) {
                    return null;
                }
                const newTask = new Task_1.Task(project.id, input.title, input.description, input.priority, input.type, undefined, undefined, input.assignee, input.deadline ? new Date(input.deadline) : undefined);
                data.tasks.push(newTask);
                this.storageService.saveData(data);
                return newTask;
            }
            getAllTasks(projectId) {
                const data = this.storageService.loadData();
                if (projectId) {
                    const project = this.projectService.getProjectById(projectId);
                    return project ? data.tasks.filter(t => t.projectId === project.id) : [];
                }
                return [...data.tasks];
            }
            getTaskById(id) {
                if (!id?.trim())
                    return undefined;
                const data = this.storageService.loadData();
                let task = data.tasks.find(t => t.id === id);
                if (!task) {
                    const matchingTasks = data.tasks.filter(t => t.id.startsWith(id));
                    if (matchingTasks.length === 1) {
                        task = matchingTasks[0];
                    }
                    else if (matchingTasks.length > 1) {
                        console.warn(`Multiple tasks found with prefix "${id}". Please use a more specific ID or full ID.`);
                        return undefined;
                    }
                }
                return task;
            }
            updateTask(id, updates) {
                const data = this.storageService.loadData();
                const taskToUpdate = this.getTaskById(id);
                if (!taskToUpdate) {
                    return undefined;
                }
                const taskIndex = data.tasks.findIndex(t => t.id === taskToUpdate.id);
                if (taskIndex === -1)
                    return undefined;
                const taskInstance = data.tasks[taskIndex];
                if (updates.title !== undefined)
                    taskInstance.title = updates.title;
                if (updates.description !== undefined)
                    taskInstance.description = updates.description;
                if (updates.priority !== undefined)
                    taskInstance.priority = updates.priority;
                if (updates.status !== undefined)
                    taskInstance.status = updates.status;
                if (updates.type !== undefined)
                    taskInstance.type = updates.type;
                if (updates.assignee !== undefined)
                    taskInstance.assignee = updates.assignee === '' ? undefined : updates.assignee;
                if (updates.deadline !== undefined) {
                    taskInstance.deadline = updates.deadline ? new Date(updates.deadline) : undefined;
                }
                taskInstance.updatedAt = new Date();
                this.storageService.saveData(data);
                return taskInstance;
            }
            deleteTask(id) {
                const data = this.storageService.loadData();
                const taskToDelete = this.getTaskById(id);
                if (!taskToDelete) {
                    return false;
                }
                const initialLength = data.tasks.length;
                data.tasks = data.tasks.filter(t => t.id !== taskToDelete.id);
                if (data.tasks.length < initialLength) {
                    this.storageService.saveData(data);
                    return true;
                }
                return false;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createTask_decorators = [logging_decorator_1.LogMethodCalls];
            _getAllTasks_decorators = [logging_decorator_1.LogMethodCalls];
            _getTaskById_decorators = [logging_decorator_1.LogMethodCalls];
            _updateTask_decorators = [logging_decorator_1.LogMethodCalls];
            __esDecorate(_a, null, _createTask_decorators, { kind: "method", name: "createTask", static: false, private: false, access: { has: obj => "createTask" in obj, get: obj => obj.createTask }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getAllTasks_decorators, { kind: "method", name: "getAllTasks", static: false, private: false, access: { has: obj => "getAllTasks" in obj, get: obj => obj.getAllTasks }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getTaskById_decorators, { kind: "method", name: "getTaskById", static: false, private: false, access: { has: obj => "getTaskById" in obj, get: obj => obj.getTaskById }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateTask_decorators, { kind: "method", name: "updateTask", static: false, private: false, access: { has: obj => "updateTask" in obj, get: obj => obj.updateTask }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TaskService = TaskService;
