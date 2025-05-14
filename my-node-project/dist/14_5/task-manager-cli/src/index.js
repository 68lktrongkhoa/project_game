"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const projectCommands_1 = require("./commands/projectCommands");
const taskCommands_1 = require("./commands/taskCommands");
const dashboardCommands_1 = require("./commands/dashboardCommands");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name('task-manager')
    .description(chalk_1.default.blueBright('A simple CLI Task Management Application'))
    .version('0.1.1', '-v, --version', 'Output the current version');
program
    .command('dashboard', { isDefault: true })
    .alias('home')
    .alias('d')
    .description('Show the dashboard overview')
    .action(dashboardCommands_1.showDashboardCommand);
// --- Project Commands ---
const project = program.command('project')
    .alias('p')
    .description('Manage projects');
project
    .command('create')
    .alias('add')
    .alias('c')
    .description('Create a new project')
    .action(projectCommands_1.addProjectCommand);
project
    .command('list')
    .alias('ls')
    .alias('l')
    .description('List all projects')
    .action(projectCommands_1.listProjectsCommand);
project
    .command('view [projectIdPrefix]')
    .alias('v')
    .description('View details of a project (use full ID or prefix)')
    .action(projectCommands_1.viewProjectCommand);
project
    .command('update [projectIdPrefix]')
    .alias('u')
    .description('Update an existing project (use full ID or prefix)')
    .action(projectCommands_1.updateProjectCommand);
project
    .command('delete [projectIdPrefix]')
    .alias('rm')
    .alias('del')
    .description('Delete a project and its tasks (use full ID or prefix)')
    .action(projectCommands_1.deleteProjectCommand);
// --- Task Commands ---
const task = program.command('task')
    .alias('t')
    .description('Manage tasks');
task
    .command('create [projectIdPrefix]')
    .alias('add')
    .alias('c')
    .description('Create a new task (optionally specify project ID/prefix)')
    .action(taskCommands_1.addTaskCommand);
task
    .command('list [projectIdPrefix]')
    .alias('ls')
    .alias('l')
    .description('List tasks (optionally filter by project ID/prefix)')
    .action(taskCommands_1.listTasksCommand);
task
    .command('view [taskIdPrefix]')
    .alias('v')
    .description('View details of a specific task (use full ID or prefix)')
    .action(taskCommands_1.viewTaskCommand);
task
    .command('update [taskIdPrefix]')
    .alias('u')
    .description('Update an existing task (use full ID or prefix)')
    .action(taskCommands_1.updateTaskCommand);
task
    .command('delete [taskIdPrefix]')
    .alias('rm')
    .alias('del')
    .description('Delete a task (use full ID or prefix)')
    .action(taskCommands_1.deleteTaskCommand);
program.parseAsync(process.argv).catch(err => {
    if (err.code === 'commander.unknownCommand' || err.code === 'commander.unknownOption') {
        return;
    }
    else {
        console.error(chalk_1.default.redBright("\nAn unexpected error occurred:"));
        console.error(err.message);
    }
    process.exit(1);
});
