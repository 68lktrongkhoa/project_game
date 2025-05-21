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
exports.DisplayService = void 0;
const chalk_1 = __importDefault(require("chalk"));
const date_fns_1 = require("date-fns");
const cli_table3_1 = __importDefault(require("cli-table3"));
const project_enums_1 = require("../types/enums/project.enums");
const task_enums_1 = require("../types/enums/task.enums");
const logging_decorator_1 = require("../decorator/logging.decorator");
let DisplayService = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _formatDate_decorators;
    let _formatStatus_decorators;
    let _formatPriority_decorators;
    let _displayProjects_decorators;
    let _displayProjectDetails_decorators;
    let _displayTasks_decorators;
    let _displayTaskDetails_decorators;
    let _displayDashboard_decorators;
    let _displayMessage_decorators;
    return _a = class DisplayService {
            formatDate(dateString) {
                if (!dateString)
                    return chalk_1.default.gray('N/A');
                try {
                    if (dateString instanceof Date) {
                        return (0, date_fns_1.format)(dateString, 'yyyy-MM-dd HH:mm');
                    }
                    return (0, date_fns_1.format)((0, date_fns_1.parseISO)(dateString), 'yyyy-MM-dd HH:mm');
                }
                catch (e) {
                    try {
                        return (0, date_fns_1.format)(new Date(dateString), 'yyyy-MM-dd HH:mm');
                    }
                    catch (error) {
                        return chalk_1.default.gray(String(dateString));
                    }
                }
            }
            formatStatus(status) {
                switch (status) {
                    case task_enums_1.TaskStatus.Open: return chalk_1.default.yellow.bold(status);
                    case task_enums_1.TaskStatus.InProgress: return chalk_1.default.blue.bold(status);
                    case task_enums_1.TaskStatus.Resolved: return chalk_1.default.green.bold(status);
                    case task_enums_1.TaskStatus.Closed: return chalk_1.default.gray.bold(status);
                    case project_enums_1.ProjectStatus.Active: return chalk_1.default.greenBright.bold(status);
                    case project_enums_1.ProjectStatus.Completed: return chalk_1.default.blueBright.bold(status);
                    case project_enums_1.ProjectStatus.Archived: return chalk_1.default.gray.bold(status);
                    default: return chalk_1.default.white(status);
                }
            }
            formatPriority(priority) {
                switch (priority) {
                    case task_enums_1.TaskPriority.Low: return chalk_1.default.green(priority);
                    case task_enums_1.TaskPriority.Medium: return chalk_1.default.yellow(priority);
                    case task_enums_1.TaskPriority.High: return chalk_1.default.red(priority);
                    default: return chalk_1.default.white(priority);
                }
            }
            displayProjects(projects) {
                if (projects.length === 0) {
                    console.log(chalk_1.default.yellow("No projects found."));
                    return;
                }
                const table = new cli_table3_1.default({
                    head: [
                        chalk_1.default.cyan('ID (Prefix)'),
                        chalk_1.default.cyan('Name'),
                        chalk_1.default.cyan('Status'),
                        chalk_1.default.cyan('Description'),
                        chalk_1.default.cyan('Created At')
                    ],
                    colWidths: [10, 25, 12, 35, 18],
                    wordWrap: true,
                    style: { head: ['blue'], border: ['grey'] }
                });
                projects.forEach(p => {
                    table.push([
                        p.id.substring(0, 8),
                        chalk_1.default.whiteBright(p.name),
                        this.formatStatus(p.status),
                        p.description || chalk_1.default.gray('N/A'),
                        this.formatDate(p.createdAt)
                    ]);
                });
                console.log(chalk_1.default.bold.blue("\n--- Projects ---"));
                console.log(table.toString());
                console.log("");
            }
            displayProjectDetails(project, tasks) {
                console.log(chalk_1.default.bold.blue(`\n--- Project Details: ${chalk_1.default.cyanBright(project.name)} ---`));
                const detailsTable = new cli_table3_1.default({ style: { compact: true, 'padding-left': 1 } });
                detailsTable.push({ [chalk_1.default.green('ID')]: project.id }, { [chalk_1.default.green('Name')]: chalk_1.default.whiteBright(project.name) }, { [chalk_1.default.green('Status')]: this.formatStatus(project.status) }, { [chalk_1.default.green('Description')]: project.description || chalk_1.default.gray('N/A') }, { [chalk_1.default.green('Created At')]: this.formatDate(project.createdAt) }, { [chalk_1.default.green('Updated At')]: this.formatDate(project.updatedAt) });
                console.log(detailsTable.toString());
                console.log(chalk_1.default.bold.magentaBright("\n  Tasks in this project:"));
                if (tasks.length === 0) {
                    console.log(chalk_1.default.yellow("  No tasks in this project."));
                }
                else {
                    this.displayTasks(tasks, false, [project]);
                }
                console.log("");
            }
            displayTasks(tasks, showProjectName = true, allProjects = []) {
                if (tasks.length === 0) {
                    console.log(chalk_1.default.yellow("ℹ️ No tasks found for the current filter."));
                    return;
                }
                const headColumns = [
                    chalk_1.default.magenta('ID (Prefix)'),
                    chalk_1.default.magenta('Title'),
                    chalk_1.default.magenta('Status'),
                    chalk_1.default.magenta('Priority'),
                    chalk_1.default.magenta('Type'),
                    chalk_1.default.magenta('Deadline'),
                ];
                const colWidthsValues = [10, 30, 14, 10, 15, 18];
                if (showProjectName) {
                    headColumns.splice(2, 0, chalk_1.default.magenta('Project'));
                    colWidthsValues.splice(2, 0, 20);
                }
                const table = new cli_table3_1.default({
                    head: headColumns,
                    colWidths: colWidthsValues,
                    wordWrap: true,
                    style: { head: ['magenta'], border: ['grey'] }
                });
                tasks.forEach(t => {
                    const row = [
                        t.id.substring(0, 8),
                        chalk_1.default.whiteBright(t.title),
                        this.formatStatus(t.status),
                        this.formatPriority(t.priority),
                        chalk_1.default.blueBright(t.type),
                        this.formatDate(t.deadline),
                    ];
                    if (showProjectName) {
                        const project = allProjects.find(p => p.id === t.projectId);
                        row.splice(2, 0, project ? chalk_1.default.cyan(project.name) : chalk_1.default.gray(t.projectId.substring(0, 8)));
                    }
                    table.push(row);
                });
                if (showProjectName && tasks.length > 0) {
                    console.log(chalk_1.default.bold.magentaBright("\n--- All Tasks ---"));
                }
                else if (tasks.length > 0) {
                    console.log(chalk_1.default.bold.magentaBright("\n--- Tasks ---"));
                }
                console.log(table.toString());
                console.log("");
            }
            displayTaskDetails(task, project) {
                console.log(chalk_1.default.bold.magentaBright(`\n--- Task Details: ${chalk_1.default.whiteBright(task.title)} ---`));
                const detailsTable = new cli_table3_1.default({ style: { compact: true, 'padding-left': 1 } });
                detailsTable.push({ [chalk_1.default.green('ID')]: task.id }, { [chalk_1.default.green('Title')]: chalk_1.default.whiteBright(task.title) });
                if (project) {
                    detailsTable.push({ [chalk_1.default.green('Project')]: `${chalk_1.default.cyan(project.name)} (${project.id.substring(0, 8)})` });
                }
                else {
                    detailsTable.push({ [chalk_1.default.green('Project ID')]: task.projectId });
                }
                detailsTable.push({ [chalk_1.default.green('Status')]: this.formatStatus(task.status) }, { [chalk_1.default.green('Priority')]: this.formatPriority(task.priority) }, { [chalk_1.default.green('Type')]: chalk_1.default.blueBright(task.type) }, { [chalk_1.default.green('Description')]: task.description || chalk_1.default.gray('N/A') }, { [chalk_1.default.green('Assignee')]: task.assignee || chalk_1.default.gray('N/A') }, { [chalk_1.default.green('Deadline')]: this.formatDate(task.deadline) }, { [chalk_1.default.green('Created At')]: this.formatDate(task.createdAt) }, { [chalk_1.default.green('Updated At')]: this.formatDate(task.updatedAt) });
                console.log(detailsTable.toString());
                console.log("");
            }
            displayDashboard(projectStats, recentTasks, allProjects) {
                console.log(chalk_1.default.bold.cyanBright("\n✨✨✨ TASK MANAGER DASHBOARD ✨✨✨"));
                const statsTable = new cli_table3_1.default({
                    head: [chalk_1.default.blue('📊 Metric'), chalk_1.default.blue('Count')],
                    colWidths: [30, 10],
                    style: { head: ['blue'], border: ['grey'] }
                });
                statsTable.push(['Total Projects', chalk_1.default.yellow(projectStats.totalProjects)], ['Tasks - Open', chalk_1.default.yellow(projectStats.open)], ['Tasks - In Progress', chalk_1.default.blue(projectStats.inProgress)], ['Tasks - Done (Resolved/Closed)', chalk_1.default.green(projectStats.done)]);
                console.log(chalk_1.default.bold.blue("\n📈 Project & Task Statistics:"));
                console.log(statsTable.toString());
                console.log(chalk_1.default.bold.blue("\n🚀 Active Projects (first 5):"));
                const activeProjects = allProjects.filter(p => p.status === project_enums_1.ProjectStatus.Active).slice(0, 5);
                if (activeProjects.length > 0) {
                    activeProjects.forEach(p => console.log(`  ${chalk_1.default.greenBright('🟢')} ${chalk_1.default.cyan(p.name)} (${p.id.substring(0, 8)})`));
                }
                else {
                    console.log(chalk_1.default.gray("  No active projects."));
                }
                console.log("");
                console.log(chalk_1.default.bold.magentaBright("⏳ Recent Tasks (last 5 created/updated):"));
                if (recentTasks.length > 0) {
                    this.displayTasks(recentTasks, true, allProjects);
                }
                else {
                    console.log(chalk_1.default.gray("  No recent tasks."));
                }
                console.log(chalk_1.default.bold.gray("\n💡 Tip: Navigate using the Main Menu options."));
                console.log("");
            }
            displayMessage(message, type = 'info') {
                switch (type) {
                    case 'success':
                        console.log(chalk_1.default.greenBright(`✅ ${message}`));
                        break;
                    case 'error':
                        console.log(chalk_1.default.redBright(`❌ ${message}`));
                        break;
                    case 'warning':
                        console.log(chalk_1.default.yellowBright(`⚠️ ${message}`));
                        break;
                    case 'info':
                    default:
                        console.log(chalk_1.default.blueBright(`ℹ️ ${message}`));
                        break;
                }
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _formatDate_decorators = [logging_decorator_1.LogMethodCalls];
            _formatStatus_decorators = [logging_decorator_1.LogMethodCalls];
            _formatPriority_decorators = [logging_decorator_1.LogMethodCalls];
            _displayProjects_decorators = [logging_decorator_1.LogMethodCalls];
            _displayProjectDetails_decorators = [logging_decorator_1.LogMethodCalls];
            _displayTasks_decorators = [logging_decorator_1.LogMethodCalls];
            _displayTaskDetails_decorators = [logging_decorator_1.LogMethodCalls];
            _displayDashboard_decorators = [logging_decorator_1.LogMethodCalls];
            _displayMessage_decorators = [logging_decorator_1.LogMethodCalls];
            __esDecorate(_a, null, _formatDate_decorators, { kind: "method", name: "formatDate", static: false, private: false, access: { has: obj => "formatDate" in obj, get: obj => obj.formatDate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _formatStatus_decorators, { kind: "method", name: "formatStatus", static: false, private: false, access: { has: obj => "formatStatus" in obj, get: obj => obj.formatStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _formatPriority_decorators, { kind: "method", name: "formatPriority", static: false, private: false, access: { has: obj => "formatPriority" in obj, get: obj => obj.formatPriority }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _displayProjects_decorators, { kind: "method", name: "displayProjects", static: false, private: false, access: { has: obj => "displayProjects" in obj, get: obj => obj.displayProjects }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _displayProjectDetails_decorators, { kind: "method", name: "displayProjectDetails", static: false, private: false, access: { has: obj => "displayProjectDetails" in obj, get: obj => obj.displayProjectDetails }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _displayTasks_decorators, { kind: "method", name: "displayTasks", static: false, private: false, access: { has: obj => "displayTasks" in obj, get: obj => obj.displayTasks }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _displayTaskDetails_decorators, { kind: "method", name: "displayTaskDetails", static: false, private: false, access: { has: obj => "displayTaskDetails" in obj, get: obj => obj.displayTaskDetails }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _displayDashboard_decorators, { kind: "method", name: "displayDashboard", static: false, private: false, access: { has: obj => "displayDashboard" in obj, get: obj => obj.displayDashboard }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _displayMessage_decorators, { kind: "method", name: "displayMessage", static: false, private: false, access: { has: obj => "displayMessage" in obj, get: obj => obj.displayMessage }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DisplayService = DisplayService;
