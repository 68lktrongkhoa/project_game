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
exports.deleteProjectCommand = exports.updateProjectCommand = exports.viewProjectCommand = exports.listProjectsCommand = exports.addProjectCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const project_enums_1 = require("../types/enums/project.enums");
let oraInstance;
async function loadOra() {
    if (!oraInstance) {
        const oraModule = await Promise.resolve().then(() => __importStar(require('ora')));
        oraInstance = oraModule.default;
    }
    return oraInstance;
}
async function selectProjectInteractive(message, projectService, displayService) {
    const projects = projectService.getAllProjects();
    if (projects.length === 0) {
        displayService.displayMessage("No projects available. Please create a project first.", "info");
        return undefined;
    }
    const { projectId } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'projectId',
            message: message,
            choices: projects.map(p => ({ name: `${p.name} (${p.id.substring(0, 8)})`, value: p.id })),
            pageSize: 10,
        },
    ]);
    return projectService.getProjectById(projectId);
}
const addProjectCommand = async (deps) => {
    const { projectService, displayService } = deps;
    const ora = await loadOra();
    let spinner;
    try {
        console.log(chalk_1.default.bold.cyan('\n✨ Creating a New Project ✨'));
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
        spinner = ora(chalk_1.default.blue('Saving project...')).start();
        const project = projectService.createProject(answers.name, answers.description);
        if (project) {
            spinner.succeed(chalk_1.default.green(`✅ Project "${project.name}" created successfully with ID ${chalk_1.default.yellow(project.id.substring(0, 8))}.`));
            displayService.displayProjectDetails(project, []);
        }
        else {
            spinner.fail(chalk_1.default.red('❗ Failed to create project.'));
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (spinner && spinner.isSpinning) {
            spinner.fail(chalk_1.default.red(`❗ Error during project creation: ${message}`));
        }
        else {
            displayService.displayMessage(`❗ Error during project creation: ${message}`, 'error');
        }
    }
};
exports.addProjectCommand = addProjectCommand;
const listProjectsCommand = async (deps) => {
    const { projectService, displayService } = deps;
    const ora = await loadOra();
    const spinner = ora(chalk_1.default.blue('Loading projects...')).start();
    try {
        const projects = projectService.getAllProjects();
        if (projects.length === 0) {
            spinner.info(chalk_1.default.yellow("ℹ️ No projects found. You can create one from the menu."));
        }
        else {
            spinner.succeed(chalk_1.default.green("Projects loaded!"));
            displayService.displayProjects(projects);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        spinner.fail(chalk_1.default.red(`❗ Failed to load projects: ${message}`));
    }
};
exports.listProjectsCommand = listProjectsCommand;
const viewProjectCommand = async (deps) => {
    const { projectService, taskService, displayService } = deps;
    const ora = await loadOra();
    let mainSpinner;
    try {
        mainSpinner = ora(chalk_1.default.blue('Processing project view...')).start();
        const projectToView = await selectProjectInteractive('👁️ Select a project to view:', projectService, displayService);
        if (projectToView) {
            mainSpinner.text = chalk_1.default.blue(`Loading tasks for project "${projectToView.name}"...`);
            const tasks = taskService.getAllTasks(projectToView.id);
            mainSpinner.succeed(chalk_1.default.green('Project and tasks loaded!'));
            displayService.displayProjectDetails(projectToView, tasks);
        }
        else if (mainSpinner.isSpinning) {
            mainSpinner.info(chalk_1.default.yellow("View operation cancelled or no project found."));
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk_1.default.red(`❗ Error viewing project: ${message}`));
        }
        else {
            displayService.displayMessage(`❗ Error viewing project: ${message}`, 'error');
        }
    }
};
exports.viewProjectCommand = viewProjectCommand;
const updateProjectCommand = async (deps) => {
    const { projectService, displayService } = deps;
    const ora = await loadOra();
    let mainSpinner;
    try {
        mainSpinner = ora(chalk_1.default.blue('Preparing project update...')).start();
        const projectToUpdate = await selectProjectInteractive('✏️ Select a project to update:', projectService, displayService);
        if (!projectToUpdate) {
            if (mainSpinner.isSpinning)
                mainSpinner.info(chalk_1.default.yellow("Update operation cancelled or no project selected."));
            return;
        }
        mainSpinner.stop();
        console.log(chalk_1.default.blue(`\n✏️ Updating project: ${projectToUpdate.name} (${projectToUpdate.id.substring(0, 8)})`));
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: `New project name (current: ${projectToUpdate.name}):`,
                default: projectToUpdate.name,
                validate: (input) => input.trim().length > 0 || 'Project name cannot be empty.'
            },
            {
                type: 'input',
                name: 'description',
                message: `New project description (current: ${projectToUpdate.description || 'N/A'}, enter to keep, type "clear" to remove):`,
                default: projectToUpdate.description || ''
            },
            {
                type: 'list',
                name: 'status',
                message: 'New project status:',
                choices: Object.values(project_enums_1.ProjectStatus),
                default: projectToUpdate.status
            },
        ]);
        const updates = {};
        if (answers.name.trim() !== projectToUpdate.name) {
            updates.name = answers.name.trim();
        }
        if (answers.description.toLowerCase() === 'clear') {
            updates.description = '';
        }
        else if (answers.description !== (projectToUpdate.description || '')) {
            updates.description = answers.description;
        }
        if (answers.status !== projectToUpdate.status) {
            updates.status = answers.status;
        }
        if (Object.keys(updates).length > 0) {
            const spinnerUpdate = ora(chalk_1.default.blue('Saving changes...')).start();
            const updatedProject = projectService.updateProject(projectToUpdate.id, updates);
            if (updatedProject) {
                spinnerUpdate.succeed(chalk_1.default.green(`✅ Project "${updatedProject.name}" updated successfully.`));
                const tasks = deps.projectService.getTasksForProject(updatedProject.id);
                displayService.displayProjectDetails(updatedProject, tasks);
            }
            else {
                spinnerUpdate.fail(chalk_1.default.red('❗ Failed to update project.'));
            }
        }
        else {
            displayService.displayMessage('No changes were made to the project.', 'info');
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk_1.default.red(`❗ Error during project update: ${message}`));
        }
        else {
            displayService.displayMessage(`❗ Error during project update: ${message}`, 'error');
        }
    }
};
exports.updateProjectCommand = updateProjectCommand;
const deleteProjectCommand = async (deps) => {
    const { projectService, displayService, taskService } = deps;
    const ora = await loadOra();
    let mainSpinner;
    try {
        mainSpinner = ora(chalk_1.default.blue('Preparing project deletion...')).start();
        const projectToDelete = await selectProjectInteractive('❌ Select a project to delete:', projectService, displayService);
        if (!projectToDelete) {
            if (mainSpinner.isSpinning)
                mainSpinner.info(chalk_1.default.yellow("Delete operation cancelled or no project selected."));
            return;
        }
        mainSpinner.stop();
        console.log(chalk_1.default.yellowBright(`\n⚠️ Deleting Project: ${projectToDelete.name} (${projectToDelete.id.substring(0, 8)})`));
        const { confirm } = await inquirer_1.default.prompt([
            { type: 'confirm', name: 'confirm', message: `Are you sure you want to PERMANENTLY delete project "${chalk_1.default.cyan(projectToDelete.name)}" and ALL its tasks? This action cannot be undone.`, default: false }
        ]);
        if (confirm) {
            const spinnerDelete = ora(chalk_1.default.blue(`Deleting project "${projectToDelete.name}"...`)).start();
            const success = projectService.deleteProject(projectToDelete.id);
            if (success) {
                spinnerDelete.succeed(chalk_1.default.green(`✅ Project "${projectToDelete.name}" and its tasks deleted successfully.`));
            }
            else {
                spinnerDelete.fail(chalk_1.default.red('❗ Failed to delete project.'));
            }
        }
        else {
            displayService.displayMessage('Project deletion cancelled by user.', 'info');
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk_1.default.red(`❗ Error during project deletion: ${message}`));
        }
        else {
            displayService.displayMessage(`❗ Error during project deletion: ${message}`, 'error');
        }
    }
};
exports.deleteProjectCommand = deleteProjectCommand;
