import { Command } from 'commander';
import {
  addProjectCommand,
  listProjectsCommand,
  viewProjectCommand,
  updateProjectCommand,
  deleteProjectCommand
} from './commands/projectCommands';
import {
  addTaskCommand,
  listTasksCommand,
  viewTaskCommand,
  updateTaskCommand,
  deleteTaskCommand
} from './commands/taskCommands'; 
import { showDashboardCommand } from './commands/dashboardCommands';
import chalk from 'chalk';

const program = new Command();

program
  .name('task-manager')
  .description(chalk.blueBright('A simple CLI Task Management Application'))
  .version('0.1.1', '-v, --version', 'Output the current version');

program
    .command('dashboard', { isDefault: true })
    .alias('home')
    .alias('d')
    .description('Show the dashboard overview')
    .action(showDashboardCommand);

// --- Project Commands ---
const project = program.command('project')
    .alias('p')
    .description('Manage projects');

project
  .command('create')
  .alias('add')
  .alias('c')
  .description('Create a new project')
  .action(addProjectCommand);

project
  .command('list')
  .alias('ls')
  .alias('l')
  .description('List all projects')
  .action(listProjectsCommand);

project
  .command('view [projectIdPrefix]')
  .alias('v')
  .description('View details of a project (use full ID or prefix)')
  .action(viewProjectCommand);

project
  .command('update [projectIdPrefix]')
  .alias('u')
  .description('Update an existing project (use full ID or prefix)')
  .action(updateProjectCommand);

project
  .command('delete [projectIdPrefix]')
  .alias('rm')
  .alias('del')
  .description('Delete a project and its tasks (use full ID or prefix)')
  .action(deleteProjectCommand);


// --- Task Commands ---
const task = program.command('task')
    .alias('t')
    .description('Manage tasks');

task
  .command('create [projectIdPrefix]')
  .alias('add')
  .alias('c')
  .description('Create a new task (optionally specify project ID/prefix)')
  .action(addTaskCommand);

task
  .command('list [projectIdPrefix]')
  .alias('ls')
  .alias('l')
  .description('List tasks (optionally filter by project ID/prefix)')
  .action(listTasksCommand);

task
  .command('view [taskIdPrefix]')
  .alias('v')
  .description('View details of a specific task (use full ID or prefix)')
  .action(viewTaskCommand);

task
  .command('update [taskIdPrefix]')
  .alias('u')
  .description('Update an existing task (use full ID or prefix)')
  .action(updateTaskCommand);

task
  .command('delete [taskIdPrefix]')
  .alias('rm')
  .alias('del')
  .description('Delete a task (use full ID or prefix)')
  .action(deleteTaskCommand);

program.parseAsync(process.argv).catch(err => {
    if (err.code === 'commander.unknownCommand' || err.code === 'commander.unknownOption') {
       return
    } else {
      console.error(chalk.redBright("\nAn unexpected error occurred:"));
      console.error(err.message)
    }
    process.exit(1);
});