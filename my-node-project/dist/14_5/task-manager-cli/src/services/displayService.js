"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayDashboard = exports.displayTaskDetails = exports.displayTasks = exports.displayProjectDetails = exports.displayProjects = void 0;
const chalk_1 = __importDefault(require("chalk"));
const types_1 = require("../types");
const date_fns_1 = require("date-fns");
const formatDate = (dateString) => {
    if (!dateString)
        return 'N/A';
    try {
        return (0, date_fns_1.format)((0, date_fns_1.parseISO)(dateString), 'yyyy-MM-dd HH:mm');
    }
    catch (e) {
        try {
            return (0, date_fns_1.format)(new Date(dateString), 'yyyy-MM-dd HH:mm');
        }
        catch (error) {
            console.warn(`Could not parse date: ${dateString}`);
            return dateString;
        }
    }
};
const displayProjects = (projects) => {
    if (projects.length === 0) {
        console.log(chalk_1.default.yellow("No projects found."));
        return;
    }
    console.log(chalk_1.default.bold.blue("\n--- Projects ---"));
    projects.forEach(p => {
        console.log(`${chalk_1.default.green(p.id.substring(0, 8))} - ${chalk_1.default.cyan(p.name)} (${chalk_1.default.magenta(p.status)}) - Created: ${formatDate(p.createdAt)}`);
        if (p.description)
            console.log(`  ${chalk_1.default.gray(p.description)}`);
    });
    console.log("");
};
exports.displayProjects = displayProjects;
const displayProjectDetails = (project, tasks) => {
    console.log(chalk_1.default.bold.blue(`\n--- Project: ${project.name} ---`));
    console.log(`${chalk_1.default.green('ID:')} ${project.id}`);
    console.log(`${chalk_1.default.green('Status:')} ${chalk_1.default.magenta(project.status)}`);
    console.log(`${chalk_1.default.green('Created:')} ${formatDate(project.createdAt)}`);
    console.log(`${chalk_1.default.green('Updated:')} ${formatDate(project.updatedAt)}`);
    if (project.description)
        console.log(`${chalk_1.default.green('Description:')} ${project.description}`);
    console.log(chalk_1.default.bold.magentaBright("\n  Tasks in this project:"));
    if (tasks.length === 0) {
        console.log(chalk_1.default.yellow("  No tasks in this project."));
    }
    else {
        (0, exports.displayTasks)(tasks, false); // Don't show project name again
    }
    console.log("");
};
exports.displayProjectDetails = displayProjectDetails;
const displayTasks = (tasks, showProjectName = true, projects = []) => {
    if (tasks.length === 0) {
        console.log(chalk_1.default.yellow("No tasks found."));
        return;
    }
    if (showProjectName && tasks.length > 0)
        console.log(chalk_1.default.bold.magentaBright("\n--- Tasks ---"));
    tasks.forEach(t => {
        let projectInfo = '';
        if (showProjectName) {
            const project = projects.find(p => p.id === t.projectId);
            projectInfo = project ? ` (Project: ${chalk_1.default.cyan(project.name)})` : ` (Project ID: ${chalk_1.default.gray(t.projectId.substring(0, 8))})`;
        }
        let statusColor = chalk_1.default.white;
        switch (t.status) {
            case types_1.TaskStatus.Open:
                statusColor = chalk_1.default.yellow;
                break;
            case types_1.TaskStatus.InProgress:
                statusColor = chalk_1.default.blue;
                break;
            case types_1.TaskStatus.Resolved:
                statusColor = chalk_1.default.green;
                break;
            case types_1.TaskStatus.Closed:
                statusColor = chalk_1.default.gray;
                break;
        }
        let priorityColor = chalk_1.default.white;
        switch (t.priority) {
            case types_1.TaskPriority.Low:
                priorityColor = chalk_1.default.greenBright;
                break;
            case types_1.TaskPriority.Medium:
                priorityColor = chalk_1.default.yellowBright;
                break;
            case types_1.TaskPriority.High:
                priorityColor = chalk_1.default.redBright;
                break;
        }
        console.log(`${chalk_1.default.green(t.id.substring(0, 8))} - ${chalk_1.default.whiteBright(t.title)} [${chalk_1.default.blueBright(t.type)}] - ${statusColor.bold(t.status)} - Priority: ${priorityColor(t.priority)}${projectInfo}`);
        if (t.description)
            console.log(`  ${chalk_1.default.gray(t.description)}`);
        if (t.assignee)
            console.log(`  Assigned to: ${chalk_1.default.magenta(t.assignee)}`);
        if (t.deadline)
            console.log(`  Deadline: ${chalk_1.default.red(formatDate(t.deadline))}`);
    });
    console.log("");
};
exports.displayTasks = displayTasks;
const displayTaskDetails = (task, project) => {
    console.log(chalk_1.default.bold.magentaBright(`\n--- Task: ${task.title} ---`));
    console.log(`${chalk_1.default.green('ID:')} ${task.id}`);
    if (project)
        console.log(`${chalk_1.default.green('Project:')} ${chalk_1.default.cyan(project.name)} (${project.id.substring(0, 8)})`);
    else
        console.log(`${chalk_1.default.green('Project ID:')} ${task.projectId}`);
    let statusColor = chalk_1.default.white;
    switch (task.status) {
        case types_1.TaskStatus.Open:
            statusColor = chalk_1.default.yellow;
            break;
        case types_1.TaskStatus.InProgress:
            statusColor = chalk_1.default.blue;
            break;
        case types_1.TaskStatus.Resolved:
            statusColor = chalk_1.default.green;
            break;
        case types_1.TaskStatus.Closed:
            statusColor = chalk_1.default.gray;
            break;
    }
    console.log(`${chalk_1.default.green('Status:')} ${statusColor.bold(task.status)}`);
    console.log(`${chalk_1.default.green('Type:')} ${chalk_1.default.blueBright(task.type)}`);
    let priorityColor = chalk_1.default.white;
    switch (task.priority) {
        case types_1.TaskPriority.Low:
            priorityColor = chalk_1.default.greenBright;
            break;
        case types_1.TaskPriority.Medium:
            priorityColor = chalk_1.default.yellowBright;
            break;
        case types_1.TaskPriority.High:
            priorityColor = chalk_1.default.redBright;
            break;
    }
    console.log(`${chalk_1.default.green('Priority:')} ${priorityColor(task.priority)}`);
    if (task.description)
        console.log(`${chalk_1.default.green('Description:')} ${task.description}`);
    if (task.assignee)
        console.log(`${chalk_1.default.green('Assignee:')} ${chalk_1.default.magenta(task.assignee)}`);
    if (task.deadline)
        console.log(`${chalk_1.default.green('Deadline:')} ${chalk_1.default.red(formatDate(task.deadline))}`);
    console.log(`${chalk_1.default.green('Created:')} ${formatDate(task.createdAt)}`);
    console.log(`${chalk_1.default.green('Updated:')} ${formatDate(task.updatedAt)}`);
    console.log("");
};
exports.displayTaskDetails = displayTaskDetails;
const displayDashboard = (projectStats, recentTasks, allProjects) => {
    console.log(chalk_1.default.bold.cyanBright("\n--- DASHBOARD ---"));
    console.log(chalk_1.default.bold.blue("\nProject Statistics:"));
    console.log(`  Total Projects: ${chalk_1.default.yellow(projectStats.totalProjects)}`);
    console.log(chalk_1.default.bold.magentaBright("\nTask Statistics (across all projects):"));
    console.log(`  Open: ${chalk_1.default.yellow(projectStats.open)}`);
    console.log(`  In Progress: ${chalk_1.default.blue(projectStats.inProgress)}`);
    console.log(`  Done (Resolved/Closed): ${chalk_1.default.green(projectStats.done)}`);
    console.log(chalk_1.default.bold.blue("\nActive Projects (first 5 or less):"));
    const activeProjects = allProjects.filter(p => p.status === types_1.ProjectStatus.Active).slice(0, 5);
    if (activeProjects.length > 0) {
        activeProjects.forEach(p => console.log(`  - ${chalk_1.default.cyan(p.name)} (${p.id.substring(0, 8)})`));
    }
    else {
        console.log(chalk_1.default.gray("  No active projects."));
    }
    console.log(chalk_1.default.bold.magentaBright("\nRecent Tasks (last 5 created/updated):"));
    if (recentTasks.length > 0) {
        (0, exports.displayTasks)(recentTasks, true, allProjects); // Truyền allProjects vào đây
    }
    else {
        console.log(chalk_1.default.gray("  No recent tasks."));
    }
    console.log(chalk_1.default.bold.gray("\nShortcuts:"));
    console.log(chalk_1.default.gray("  Use 'npm start -- help' or 'node dist/index.js help' to see all commands."));
    console.log(chalk_1.default.gray("  Examples:"));
    console.log(chalk_1.default.gray("    npm start -- project create"));
    console.log(chalk_1.default.gray("    npm start -- task add"));
    console.log("");
};
exports.displayDashboard = displayDashboard;
