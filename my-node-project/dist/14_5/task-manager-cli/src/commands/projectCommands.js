"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectCommand = exports.updateProjectCommand = exports.viewProjectCommand = exports.listProjectsCommand = exports.addProjectCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const projectService_1 = require("../services/projectService");
const taskService_1 = require("../services/taskService");
const displayService_1 = require("../services/displayService");
const types_1 = require("../types");
const addProjectCommand = async () => {
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Project name:',
            validate: function (input) {
                if (input.trim().length === 0) {
                    return 'Project name cannot be empty.';
                }
                return true;
            }
        },
        { type: 'input', name: 'description', message: 'Project description (optional):' },
    ]);
    const project = (0, projectService_1.createProject)(answers.name, answers.description);
    console.log(chalk_1.default.green(`Project "${project.name}" created with ID ${chalk_1.default.yellow(project.id.substring(0, 8))}.`));
};
exports.addProjectCommand = addProjectCommand;
const listProjectsCommand = () => {
    const projects = (0, projectService_1.getAllProjects)();
    (0, displayService_1.displayProjects)(projects);
};
exports.listProjectsCommand = listProjectsCommand;
const viewProjectCommand = async (projectIdPrefix) => {
    let projectToViewId = projectIdPrefix;
    if (!projectToViewId) {
        const projects = (0, projectService_1.getAllProjects)();
        if (projects.length === 0) {
            console.log(chalk_1.default.yellow("No projects available to view. Create one first!"));
            return;
        }
        const { id } = await inquirer_1.default.prompt([{
                type: 'list',
                name: 'id',
                message: 'Select a project to view:',
                choices: projects.map(p => ({ name: `${p.name} (${p.id.substring(0, 8)})`, value: p.id }))
            }]);
        projectToViewId = id;
    }
    const project = (0, projectService_1.getProjectById)(projectToViewId);
    if (project) {
        const tasks = (0, taskService_1.getAllTasks)(project.id);
        (0, displayService_1.displayProjectDetails)(project, tasks);
    }
    else {
        console.log(chalk_1.default.red(`Project with ID or prefix "${projectToViewId}" not found.`));
    }
};
exports.viewProjectCommand = viewProjectCommand;
const updateProjectCommand = async (projectIdPrefix) => {
    let projectToUpdateId = projectIdPrefix;
    if (!projectToUpdateId) {
        const projects = (0, projectService_1.getAllProjects)();
        if (projects.length === 0) {
            console.log(chalk_1.default.yellow("No projects available to update."));
            return;
        }
        const { id } = await inquirer_1.default.prompt([{
                type: 'list',
                name: 'id',
                message: 'Select a project to update:',
                choices: projects.map(p => ({ name: `${p.name} (${p.id.substring(0, 8)})`, value: p.id }))
            }]);
        projectToUpdateId = id;
    }
    const project = (0, projectService_1.getProjectById)(projectToUpdateId);
    if (!project) {
        console.log(chalk_1.default.red(`Project with ID or prefix "${projectToUpdateId}" not found.`));
        return;
    }
    console.log(chalk_1.default.blue(`\nUpdating project: ${project.name} (${project.id.substring(0, 8)})`));
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'New project name (leave blank to keep current):',
            default: project.name,
            validate: function (input, currentAnswers) {
                if (input.trim().length === 0 && project.name === currentAnswers.name) {
                    return true;
                }
                if (input.trim().length === 0 && project.name !== input) {
                    return 'Project name cannot be empty if you intend to change it.';
                }
                return true;
            }
        },
        { type: 'input', name: 'description', message: 'New project description (leave blank to keep current, type "clear" to remove):', default: project.description || '' },
        { type: 'list', name: 'status', message: 'New project status:', choices: Object.values(types_1.ProjectStatus), default: project.status },
    ]);
    const updates = {};
    if (answers.name && answers.name !== project.name)
        updates.name = answers.name;
    if (answers.description.toLowerCase() === 'clear') {
        updates.description = undefined;
    }
    else if (answers.description !== project.description) {
        updates.description = answers.description || undefined;
    }
    if (answers.status !== project.status)
        updates.status = answers.status;
    if (Object.keys(updates).length > 0) {
        const updated = (0, projectService_1.updateProject)(project.id, updates); // Update bằng ID đầy đủ
        if (updated) {
            console.log(chalk_1.default.green(`Project "${updated.name}" updated.`));
            (0, displayService_1.displayProjectDetails)(updated, (0, taskService_1.getAllTasks)(updated.id));
        }
        else {
            console.log(chalk_1.default.red('Failed to update project (this should not happen if project was found).'));
        }
    }
    else {
        console.log(chalk_1.default.yellow('No changes made to the project.'));
    }
};
exports.updateProjectCommand = updateProjectCommand;
const deleteProjectCommand = async (projectIdPrefix) => {
    let projectToDeleteId = projectIdPrefix;
    if (!projectToDeleteId) {
        const projects = (0, projectService_1.getAllProjects)();
        if (projects.length === 0) {
            console.log(chalk_1.default.yellow("No projects available to delete."));
            return;
        }
        const { id } = await inquirer_1.default.prompt([{
                type: 'list',
                name: 'id',
                message: 'Select a project to delete:',
                choices: projects.map(p => ({ name: `${p.name} (${p.id.substring(0, 8)})`, value: p.id }))
            }]);
        projectToDeleteId = id;
    }
    const project = (0, projectService_1.getProjectById)(projectToDeleteId);
    if (!project) {
        console.log(chalk_1.default.red(`Project with ID or prefix "${projectToDeleteId}" not found.`));
        return;
    }
    const { confirm } = await inquirer_1.default.prompt([
        { type: 'confirm', name: 'confirm', message: `Are you sure you want to delete project "${chalk_1.default.cyan(project.name)}" and ALL its tasks? This cannot be undone.`, default: false }
    ]);
    if (confirm) {
        if ((0, projectService_1.deleteProject)(project.id)) {
            console.log(chalk_1.default.green(`Project "${project.name}" and its tasks deleted.`));
        }
        else {
            console.log(chalk_1.default.red('Failed to delete project (it might have been already deleted or ID issue).'));
        }
    }
    else {
        console.log(chalk_1.default.yellow('Project deletion cancelled.'));
    }
};
exports.deleteProjectCommand = deleteProjectCommand;
