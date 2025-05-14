"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showDashboardCommand = void 0;
const projectService_1 = require("../services/projectService");
const taskService_1 = require("../services/taskService");
const displayService_1 = require("../services/displayService");
const types_1 = require("../types");
const showDashboardCommand = () => {
    const projects = (0, projectService_1.getAllProjects)();
    const tasks = (0, taskService_1.getAllTasks)();
    const projectStats = {
        totalProjects: projects.length,
        open: tasks.filter(t => t.status === types_1.TaskStatus.Open).length,
        inProgress: tasks.filter(t => t.status === types_1.TaskStatus.InProgress).length,
        done: tasks.filter(t => t.status === types_1.TaskStatus.Resolved || t.status === types_1.TaskStatus.Closed).length,
    };
    const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);
    (0, displayService_1.displayDashboard)(projectStats, recentTasks, projects);
};
exports.showDashboardCommand = showDashboardCommand;
