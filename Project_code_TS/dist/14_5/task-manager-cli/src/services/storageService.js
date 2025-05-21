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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
const logging_decorator_1 = require("../decorator/logging.decorator");
let StorageService = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _ensureDataFileExists_decorators;
    let _loadData_decorators;
    let _saveData_decorators;
    return _a = class StorageService {
            constructor(fileName = 'task-manager-data.json') {
                this.filePath = __runInitializers(this, _instanceExtraInitializers);
                this.defaultData = { projects: [], tasks: [] };
                this.filePath = path_1.default.join(process.cwd(), fileName);
                this.ensureDataFileExists();
            }
            ensureDataFileExists() {
                try {
                    if (!fs_1.default.existsSync(this.filePath)) {
                        fs_1.default.writeFileSync(this.filePath, JSON.stringify(this.defaultData, null, 2), 'utf-8');
                        console.log(`Data file created at: ${this.filePath}`);
                    }
                }
                catch (error) {
                    console.error('Error ensuring data file exists:', error);
                }
            }
            loadData() {
                try {
                    const fileContent = fs_1.default.readFileSync(this.filePath, 'utf-8');
                    const plainData = JSON.parse(fileContent);
                    const projects = (plainData.projects || []).map((pObj) => Project_1.Project.fromPlainObject(pObj));
                    const tasks = (plainData.tasks || []).map((tObj) => Task_1.Task.fromPlainObject(tObj));
                    return { projects, tasks };
                }
                catch (error) {
                    console.error(`Error loading data from ${this.filePath}:`, error.message);
                    return { ...this.defaultData };
                }
            }
            saveData(data) {
                try {
                    fs_1.default.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
                }
                catch (error) {
                    console.error(`Error saving data to ${this.filePath}:`, error.message);
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ensureDataFileExists_decorators = [logging_decorator_1.LogMethodCalls];
            _loadData_decorators = [logging_decorator_1.LogMethodCalls];
            _saveData_decorators = [logging_decorator_1.LogMethodCalls];
            __esDecorate(_a, null, _ensureDataFileExists_decorators, { kind: "method", name: "ensureDataFileExists", static: false, private: false, access: { has: obj => "ensureDataFileExists" in obj, get: obj => obj.ensureDataFileExists }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _loadData_decorators, { kind: "method", name: "loadData", static: false, private: false, access: { has: obj => "loadData" in obj, get: obj => obj.loadData }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _saveData_decorators, { kind: "method", name: "saveData", static: false, private: false, access: { has: obj => "saveData" in obj, get: obj => obj.saveData }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.StorageService = StorageService;
