#!/usr/bin/env ts-node
// src/index.ts
import inquirer from 'inquirer';
import chalk from 'chalk';
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
import { getAllProjects } from './services/projectService';


enum MainMenuChoice {
  Dashboard = "📊 Show Dashboard",
  ManageProjects = "📁 Manage Projects",
  ManageTasks = "📝 Manage Tasks",
  Exit = "🚪 Exit"
}

enum ProjectMenuChoice {
  CreateProject = "➕ Create New Project",
  ListProjects = "📋 List All Projects",
  ViewProject = "👁️ View Project Details",
  UpdateProject = "✏️ Update Project",
  DeleteProject = "❌ Delete Project",
  Back = "↩️ Back to Main Menu"
}

enum TaskMenuChoice {
  CreateTask = "➕ Create New Task",
  ListTasksAll = "📋 List All Tasks",
  ListTasksByProject = "📑 List Tasks by Project",
  ViewTask = "👁️ View Task Details",
  UpdateTask = "✏️ Update Task",
  DeleteTask = "❌ Delete Task",
  Back = "↩️ Back to Main Menu"
}

async function pressEnterToContinue() {
    await inquirer.prompt({
        type: 'input',
        name: 'continue',
        message: chalk.dim('Press Enter to return to the menu...'),
        default:''
    });
}

async function projectMenuFlow() {
  let running = true;
  while (running) {
    console.clear();
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: chalk.blueBright('--- 📁 Project Management ---'), 
        choices: Object.values(ProjectMenuChoice),
      },
    ]);

    console.clear();
    switch (choice) {
      case ProjectMenuChoice.CreateProject:
        await addProjectCommand();
        break;
      case ProjectMenuChoice.ListProjects:
        await listProjectsCommand(); 
        break;
      case ProjectMenuChoice.ViewProject:
        await viewProjectCommand();
        break;
      case ProjectMenuChoice.UpdateProject:
        await updateProjectCommand();
        break;
      case ProjectMenuChoice.DeleteProject:
        await deleteProjectCommand();
        break;
      case ProjectMenuChoice.Back:
        running = false;
        break;
    }
    if (running) {
        await pressEnterToContinue();
    }
  }
}

async function taskMenuFlow() {
  let running = true;
  while (running) {
    console.clear();
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: chalk.blueBright('--- 📝 Task Management ---'), 
        choices: Object.values(TaskMenuChoice),
      },
    ]);

    console.clear(); 
    switch (choice) {
      case TaskMenuChoice.CreateTask:
        await addTaskCommand();
        break;
      case TaskMenuChoice.ListTasksAll:
        await listTasksCommand(); 
        break;
      case TaskMenuChoice.ListTasksByProject:
        const projects = getAllProjects();
        if (projects.length === 0) {
            console.log(chalk.yellow("ℹ️ No projects available. Create a project first."));
            break;
        }
        const { projectId } = await inquirer.prompt([{
            type: 'list',
            name: 'projectId',
            message: 'Select a project to list its tasks:',
            choices: projects.map(p => ({ name: `${p.name} (${p.id.substring(0,8)})`, value: p.id }))
        }]);
        await listTasksCommand(projectId); 
        break;
      case TaskMenuChoice.ViewTask:
        await viewTaskCommand();
        break;
      case TaskMenuChoice.UpdateTask:
        await updateTaskCommand();
        break;
      case TaskMenuChoice.DeleteTask:
        await deleteTaskCommand();
        break;
      case TaskMenuChoice.Back:
        running = false;
        break;
    }
     if (running) {
        await pressEnterToContinue();
    }
  }
}

async function mainMenuFlow() {
  console.clear();
  console.log(chalk.bold.cyanBright("\n🎉 Welcome to the Advanced Task Manager CLI! 🎉"));
  let running = true;
  while (running) {
    console.clear();
    console.log(chalk.bold.yellow("\n--- 🌟 Main Menu 🌟 ---"));
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: Object.values(MainMenuChoice),
        pageSize: 10
      },
    ]);

    console.clear(); 
    switch (choice) {
      case MainMenuChoice.Dashboard:
        await showDashboardCommand();
        await pressEnterToContinue();
        break;
      case MainMenuChoice.ManageProjects:
        await projectMenuFlow();
        break;
      case MainMenuChoice.ManageTasks:
        await taskMenuFlow();
        break;
      case MainMenuChoice.Exit:
        running = false;
        console.log(chalk.bold.cyanBright("\n👋 Exiting Task Manager. Goodbye & Have a great day! 👋"));
        break;
    }
  }
}

mainMenuFlow().catch(err => {
  console.clear();
  console.error(chalk.redBright("\n❗❗❗ An Unexpected Error Occurred ❗❗❗"));
  console.error(chalk.red(err.message || 'Unknown error.'));
  if (err.stack) {
    console.error(chalk.gray(err.stack)); 
  }
  console.log(chalk.yellow("\nPlease try restarting the application. If the problem persists, check the logs or report the issue."));
  process.exit(1);
});