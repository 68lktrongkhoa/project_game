"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showDashboardCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const task_enums_1 = require("../types/enums/task.enums");
let oraInstance;
async function loadOra() {
    if (!oraInstance) {
        const oraModule = await Promise.resolve().then(() => __importStar(require('ora')));
        oraInstance = oraModule.default;
    }
    return oraInstance;
}
const showDashboardCommand = async (dependencies) => {
    const { projectService, taskService, displayService } = dependencies;
    const ora = await loadOra();
    const spinner = ora(chalk_1.default.blue('📊 Loading dashboard data...')).start();
    try {
        const projects = projectService.getAllProjects();
        const tasks = taskService.getAllTasks();
        const projectStats = {
            totalProjects: projects.length,
            open: tasks.filter(t => t.status === task_enums_1.TaskStatus.Open).length,
            inProgress: tasks.filter(t => t.status === task_enums_1.TaskStatus.InProgress).length,
            done: tasks.filter(t => t.status === task_enums_1.TaskStatus.Resolved || t.status === task_enums_1.TaskStatus.Closed).length,
        };
        const recentTasks = [...tasks]
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5);
        spinner.succeed(chalk_1.default.green('📊 Dashboard data loaded successfully!'));
        displayService.displayDashboard(projectStats, recentTasks, projects);
    }
    catch (error) {
        if (spinner && spinner.isSpinning) {
            spinner.fail(chalk_1.default.red('❗ Failed to load dashboard data.'));
        }
        else {
            console.error(chalk_1.default.red('❗ Failed to load dashboard data.'));
        }
        if (error instanceof Error) {
            console.error(chalk_1.default.red(error.message));
        }
        else {
            console.error(chalk_1.default.red('An unknown error occurred while loading dashboard.'));
        }
    }
};
exports.showDashboardCommand = showDashboardCommand;
