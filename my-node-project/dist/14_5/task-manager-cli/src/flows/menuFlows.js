"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainMenuFlow = mainMenuFlow;
const inquirer_1 = __importDefault(require("inquirer"));
const projectService_1 = require("../services/projectService");
const taskService_1 = require("../services/taskService");
const displayService_1 = require("../services/displayService");
const storageService_1 = require("../services/storageService");
const projectCommands_1 = require("../commands/projectCommands");
const taskCommands_1 = require("../commands/taskCommands");
const dashboardCommands_1 = require("../commands/dashboardCommands");
const menu_enums_1 = require("../types/enums/menu.enums");
const uiUtils_1 = require("../utils/uiUtils");
const uiTexts_1 = require("../constants/uiTexts");
async function projectMenuFlow(services) {
    const { projectService, taskService, displayService } = services;
    let running = true;
    while (running) {
        console.clear();
        const { choice } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'choice',
                message: (0, uiTexts_1.TITLE_STYLE)('--- 📁 Project Management ---'),
                choices: Object.values(menu_enums_1.ProjectMenuChoice),
            },
        ]);
        console.clear();
        switch (choice) {
            case menu_enums_1.ProjectMenuChoice.CreateProject:
                await (0, projectCommands_1.addProjectCommand)({ projectService, displayService });
                break;
            case menu_enums_1.ProjectMenuChoice.ListProjects:
                await (0, projectCommands_1.listProjectsCommand)({ projectService, displayService });
                break;
            case menu_enums_1.ProjectMenuChoice.ViewProject:
                await (0, projectCommands_1.viewProjectCommand)({ projectService, taskService, displayService });
                break;
            case menu_enums_1.ProjectMenuChoice.UpdateProject:
                await (0, projectCommands_1.updateProjectCommand)({ projectService, displayService });
                break;
            case menu_enums_1.ProjectMenuChoice.DeleteProject:
                await (0, projectCommands_1.deleteProjectCommand)({ projectService, taskService, displayService });
                break;
            case menu_enums_1.ProjectMenuChoice.Back:
                running = false;
                break;
            default:
                console.log((0, uiTexts_1.ERROR_STYLE)("Invalid choice. This should not happen."));
                break;
        }
        if (running) {
            await (0, uiUtils_1.pressEnterToContinue)();
        }
    }
}
async function taskMenuFlow(services) {
    const { taskService, projectService, displayService } = services;
    let running = true;
    while (running) {
        console.clear();
        const { choice } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'choice',
                message: (0, uiTexts_1.TITLE_STYLE)('--- 📝 Task Management ---'),
                choices: Object.values(menu_enums_1.TaskMenuChoice),
            },
        ]);
        console.clear();
        switch (choice) {
            case menu_enums_1.TaskMenuChoice.CreateTask:
                await (0, taskCommands_1.addTaskCommand)({ taskService, projectService, displayService });
                break;
            case menu_enums_1.TaskMenuChoice.ListTasksAll:
                await (0, taskCommands_1.listTasksCommand)({ taskService, projectService, displayService });
                break;
            case menu_enums_1.TaskMenuChoice.ListTasksByProject:
                {
                    const projects = projectService.getAllProjects();
                    if (projects.length === 0) {
                        console.log((0, uiTexts_1.INFO_STYLE)("ℹ️ No projects available. Create a project first."));
                        break;
                    }
                    const { projectId } = await inquirer_1.default.prompt([{
                            type: 'list',
                            name: 'projectId',
                            message: 'Select a project to list its tasks:',
                            choices: projects.map(p => ({ name: `${p.name} (${p.id.substring(0, 8)})`, value: p.id }))
                        }]);
                    await (0, taskCommands_1.listTasksCommand)({ taskService, projectService, displayService, projectId });
                }
                break;
            case menu_enums_1.TaskMenuChoice.ViewTask:
                await (0, taskCommands_1.viewTaskCommand)({ taskService, projectService, displayService });
                break;
            case menu_enums_1.TaskMenuChoice.UpdateTask:
                await (0, taskCommands_1.updateTaskCommand)({ taskService, projectService, displayService });
                break;
            case menu_enums_1.TaskMenuChoice.DeleteTask:
                await (0, taskCommands_1.deleteTaskCommand)({ taskService, projectService, displayService });
                break;
            case menu_enums_1.TaskMenuChoice.Back:
                running = false;
                break;
            default:
                console.log((0, uiTexts_1.ERROR_STYLE)("Invalid choice. This should not happen."));
                break;
        }
        if (running) {
            await (0, uiUtils_1.pressEnterToContinue)();
        }
    }
}
async function mainMenuFlow() {
    const storageService = new storageService_1.StorageService();
    const projectService = new projectService_1.ProjectService(storageService);
    const taskService = new taskService_1.TaskService(storageService, projectService);
    const displayService = new displayService_1.DisplayService();
    const appServices = {
        projectService,
        taskService,
        displayService,
        storageService
    };
    console.clear();
    console.log((0, uiTexts_1.SUCCESS_STYLE)("\n🎉 Welcome to the Advanced Task Manager CLI! 🎉"));
    await new Promise(resolve => setTimeout(resolve, 500));
    let running = true;
    while (running) {
        console.clear();
        console.log((0, uiTexts_1.MENU_HEADER_STYLE)("\n--- 🌟 Main Menu 🌟 ---"));
        const { choice } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: Object.values(menu_enums_1.MainMenuChoice),
                pageSize: 10
            },
        ]);
        console.clear();
        switch (choice) {
            case menu_enums_1.MainMenuChoice.Dashboard:
                await (0, dashboardCommands_1.showDashboardCommand)(appServices);
                await (0, uiUtils_1.pressEnterToContinue)();
                break;
            case menu_enums_1.MainMenuChoice.ManageProjects:
                await projectMenuFlow(appServices);
                break;
            case menu_enums_1.MainMenuChoice.ManageTasks:
                await taskMenuFlow(appServices);
                break;
            case menu_enums_1.MainMenuChoice.Exit:
                running = false;
                console.log((0, uiTexts_1.SUCCESS_STYLE)("\n👋 Exiting Task Manager. Goodbye & Have a great day! 👋"));
                break;
            default:
                console.log((0, uiTexts_1.ERROR_STYLE)("Invalid choice. This should not happen."));
                break;
        }
    }
}
