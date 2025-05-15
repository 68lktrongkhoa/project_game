import inquirer from 'inquirer';
import { ProjectService } from '../services/projectService';
import { TaskService } from '../services/taskService';
import { DisplayService } from '../services/displayService'; 
import { StorageService } from '../services/storageService';

import {
  addProjectCommand,
  listProjectsCommand,
  viewProjectCommand,
  updateProjectCommand,
  deleteProjectCommand
} from '../commands/projectCommands';
import {
  addTaskCommand,
  listTasksCommand,
  viewTaskCommand,
  updateTaskCommand,
  deleteTaskCommand
} from '../commands/taskCommands';
import { showDashboardCommand } from '../commands/dashboardCommands';

import { MainMenuChoice, ProjectMenuChoice, TaskMenuChoice } from '../types/enums/menu.enums';
import { pressEnterToContinue } from '../utils/uiUtils';
import {
  TITLE_STYLE,
  MENU_HEADER_STYLE,
  ERROR_STYLE,
  INFO_STYLE,
  SUCCESS_STYLE
} from '../constants/uiTexts'; 
import { Project } from '../models/Project';

interface AppServices {
  projectService: ProjectService;
  taskService: TaskService;
  displayService: DisplayService;
  storageService: StorageService;
}

async function projectMenuFlow(services: AppServices): Promise<void> {
  const { projectService, taskService, displayService } = services; 
  let running = true;
  while (running) {
    console.clear();
    const { choice } = await inquirer.prompt<{ choice: ProjectMenuChoice }>([
      {
        type: 'list',
        name: 'choice',
        message: TITLE_STYLE('--- 📁 Project Management ---'),
        choices: Object.values(ProjectMenuChoice),
      },
    ]);

    console.clear();
    switch (choice) {
      case ProjectMenuChoice.CreateProject:
        await addProjectCommand({ projectService, displayService });
        break;
      case ProjectMenuChoice.ListProjects:
        await listProjectsCommand({ projectService, displayService });
        break;
      case ProjectMenuChoice.ViewProject:
        await viewProjectCommand({ projectService, taskService, displayService });
        break;
      case ProjectMenuChoice.UpdateProject:
        await updateProjectCommand({ projectService, displayService });
        break;
      case ProjectMenuChoice.DeleteProject:
        await deleteProjectCommand({ projectService, taskService, displayService });
        break;
      case ProjectMenuChoice.Back:
        running = false;
        break;
      default:
        console.log(ERROR_STYLE("Invalid choice. This should not happen."));
        break;
    }
    if (running) {
        await pressEnterToContinue();
    }
  }
}

async function taskMenuFlow(services: AppServices): Promise<void> {
  const { taskService, projectService, displayService } = services;
  let running = true;
  while (running) {
    console.clear();
    const { choice } = await inquirer.prompt<{ choice: TaskMenuChoice }>([
      {
        type: 'list',
        name: 'choice',
        message: TITLE_STYLE('--- 📝 Task Management ---'),
        choices: Object.values(TaskMenuChoice),
      },
    ]);

    console.clear();
    switch (choice) {
      case TaskMenuChoice.CreateTask:
        await addTaskCommand({ taskService, projectService, displayService });
        break;
      case TaskMenuChoice.ListTasksAll:
        await listTasksCommand({ taskService, projectService, displayService });
        break;
      case TaskMenuChoice.ListTasksByProject:
        {
            const projects: Project[] = projectService.getAllProjects();
            if (projects.length === 0) {
                console.log(INFO_STYLE("ℹ️ No projects available. Create a project first."));
                break;
            }
            const { projectId } = await inquirer.prompt<{ projectId: string }>([{
                type: 'list',
                name: 'projectId',
                message: 'Select a project to list its tasks:',
                choices: projects.map(p => ({ name: `${p.name} (${p.id.substring(0,8)})`, value: p.id }))
            }]);
            await listTasksCommand({ taskService, projectService, displayService, projectId });
        }
        break;
      case TaskMenuChoice.ViewTask:
        await viewTaskCommand({ taskService, projectService, displayService });
        break;
      case TaskMenuChoice.UpdateTask:
        await updateTaskCommand({ taskService, projectService, displayService });
        break;
      case TaskMenuChoice.DeleteTask:
        await deleteTaskCommand({ taskService, projectService ,displayService });
        break;
      case TaskMenuChoice.Back:
        running = false;
        break;
      default:
        console.log(ERROR_STYLE("Invalid choice. This should not happen."));
        break;
    }
     if (running) {
        await pressEnterToContinue();
    }
  }
}

export async function mainMenuFlow(): Promise<void> {
  const storageService = new StorageService();
  const projectService = new ProjectService(storageService);
  const taskService = new TaskService(storageService, projectService);
  const displayService = new DisplayService();

  const appServices: AppServices = {
    projectService,
    taskService,
    displayService,
    storageService
  };

  console.clear();
  console.log(SUCCESS_STYLE("\n🎉 Welcome to the Advanced Task Manager CLI! 🎉"));
  await new Promise(resolve => setTimeout(resolve, 500));

  let running = true;
  while (running) {
    console.clear();
    console.log(MENU_HEADER_STYLE("\n--- 🌟 Main Menu 🌟 ---"));
    const { choice } = await inquirer.prompt<{ choice: MainMenuChoice }>([
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
        await showDashboardCommand(appServices);
        await pressEnterToContinue();
        break;
      case MainMenuChoice.ManageProjects:
        await projectMenuFlow(appServices);
        break;
      case MainMenuChoice.ManageTasks:
        await taskMenuFlow(appServices);
        break;
      case MainMenuChoice.Exit:
        running = false;
        console.log(SUCCESS_STYLE("\n👋 Exiting Task Manager. Goodbye & Have a great day! 👋"));
        break;
      default:
        console.log(ERROR_STYLE("Invalid choice. This should not happen."));
        break;
    }
  }
}