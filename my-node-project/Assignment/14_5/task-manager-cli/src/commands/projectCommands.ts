import inquirer from 'inquirer';
import chalk from 'chalk';
import { ProjectService } from '../services/projectService';
import { TaskService } from '../services/taskService';
import { DisplayService } from '../services/displayService';

import { Project } from '../models/Project';
import { Task } from '../models/Task';

import { ProjectStatus } from '../types/enums/project.enums';

let oraInstance: any;
async function loadOra() {
    if (!oraInstance) {
        const oraModule = await import('ora');
        oraInstance = oraModule.default;
    }
    return oraInstance;
}

interface BaseProjectCommandDeps {
    projectService: ProjectService;
    displayService: DisplayService;
}

interface ViewProjectCommandDeps extends BaseProjectCommandDeps {
    taskService: TaskService;
}

interface DeleteProjectCommandDeps extends BaseProjectCommandDeps {
    taskService: TaskService; 
}
async function selectProjectInteractive(
    message: string,
    projectService: ProjectService,
    displayService: DisplayService
): Promise<Project | undefined> {
    const projects = projectService.getAllProjects();

    if (projects.length === 0) {
        displayService.displayMessage("No projects available. Please create a project first.", "info");
        return undefined;
    }

    const { projectId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'projectId',
            message: message,
            choices: projects.map(p => ({ name: `${p.name} (${p.id.substring(0, 8)})`, value: p.id })),
            pageSize: 10,
        },
    ]);
    return projectService.getProjectById(projectId as string);
}

export const addProjectCommand = async (deps: BaseProjectCommandDeps) => {
    const { projectService, displayService } = deps;
    const ora = await loadOra();
    let spinner: any;

    try {
        console.log(chalk.bold.cyan('\n✨ Creating a New Project ✨'));
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Project name:',
                validate: function (input: string) {
                    if (input.trim().length === 0) {
                        return 'Project name cannot be empty.';
                    }
                    return true;
                }
            },
            { type: 'input', name: 'description', message: 'Project description (optional):' },
        ]);

        spinner = ora(chalk.blue('Saving project...')).start();
        const project = projectService.createProject(answers.name, answers.description);
        if (project) {
            spinner.succeed(chalk.green(`✅ Project "${project.name}" created successfully with ID ${chalk.yellow(project.id.substring(0,8))}.`));
            displayService.displayProjectDetails(project, []);
        } else {
            spinner.fail(chalk.red('❗ Failed to create project.'));
        }

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (spinner && spinner.isSpinning) {
            spinner.fail(chalk.red(`❗ Error during project creation: ${message}`));
        } else {
            displayService.displayMessage(`❗ Error during project creation: ${message}`, 'error');
        }
    }
};

export const listProjectsCommand = async (deps: BaseProjectCommandDeps) => {
    const { projectService, displayService } = deps;
    const ora = await loadOra();
    const spinner = ora(chalk.blue('Loading projects...')).start();
    try {
        const projects = projectService.getAllProjects();

        if (projects.length === 0) {
          spinner.info(chalk.yellow("ℹ️ No projects found. You can create one from the menu."));
        } else {
          spinner.succeed(chalk.green("Projects loaded!"));
          displayService.displayProjects(projects);
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        spinner.fail(chalk.red(`❗ Failed to load projects: ${message}`));
    }
};

export const viewProjectCommand = async (deps: ViewProjectCommandDeps) => {
    const { projectService, taskService, displayService } = deps;
    const ora = await loadOra();
    let mainSpinner: any;
    try {
        mainSpinner = ora(chalk.blue('Processing project view...')).start();
        const projectToView = await selectProjectInteractive('👁️ Select a project to view:', projectService, displayService);

        if (projectToView) {
            mainSpinner.text = chalk.blue(`Loading tasks for project "${projectToView.name}"...`);
            const tasks: Task[] = taskService.getAllTasks(projectToView.id);
            mainSpinner.succeed(chalk.green('Project and tasks loaded!'));
            displayService.displayProjectDetails(projectToView, tasks); 
        } else if (mainSpinner.isSpinning) {
            mainSpinner.info(chalk.yellow("View operation cancelled or no project found."));
        }

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red(`❗ Error viewing project: ${message}`));
        } else {
            displayService.displayMessage(`❗ Error viewing project: ${message}`, 'error');
        }
    }
};

export const updateProjectCommand = async (deps: BaseProjectCommandDeps) => {
    const { projectService, displayService } = deps;
    const ora = await loadOra();
    let mainSpinner: any; 
    try {
        mainSpinner = ora(chalk.blue('Preparing project update...')).start();
        const projectToUpdate = await selectProjectInteractive('✏️ Select a project to update:', projectService, displayService);

        if (!projectToUpdate) {
            if (mainSpinner.isSpinning) mainSpinner.info(chalk.yellow("Update operation cancelled or no project selected."));
            return;
        }
        mainSpinner.stop();

        console.log(chalk.blue(`\n✏️ Updating project: ${projectToUpdate.name} (${projectToUpdate.id.substring(0,8)})`));
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: `New project name (current: ${projectToUpdate.name}):`,
                default: projectToUpdate.name,
                validate: (input: string) => input.trim().length > 0 || 'Project name cannot be empty.'
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
                choices: Object.values(ProjectStatus),
                default: projectToUpdate.status
            },
        ]);

        const updates: Partial<Pick<Project, 'name' | 'description' | 'status'>> = {};
        if (answers.name.trim() !== projectToUpdate.name) {
            updates.name = answers.name.trim();
        }

        if (answers.description.toLowerCase() === 'clear') {
            updates.description = '';
        } else if (answers.description !== (projectToUpdate.description || '')) {
            updates.description = answers.description;
        }

        if (answers.status !== projectToUpdate.status) {
            updates.status = answers.status;
        }

        if (Object.keys(updates).length > 0) {
            const spinnerUpdate = ora(chalk.blue('Saving changes...')).start();
            const updatedProject = projectService.updateProject(projectToUpdate.id, updates);
            if (updatedProject) {
                spinnerUpdate.succeed(chalk.green(`✅ Project "${updatedProject.name}" updated successfully.`));
                const tasks = deps.projectService.getTasksForProject(updatedProject.id);
                displayService.displayProjectDetails(updatedProject, tasks);
            } else {
                spinnerUpdate.fail(chalk.red('❗ Failed to update project.'));
            }
        } else {
            displayService.displayMessage('No changes were made to the project.', 'info');
        }

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red(`❗ Error during project update: ${message}`));
        } else {
            displayService.displayMessage(`❗ Error during project update: ${message}`, 'error');
        }
    }
};

export const deleteProjectCommand = async (deps: DeleteProjectCommandDeps) => {
    const { projectService, displayService, taskService } = deps;
    const ora = await loadOra();
    let mainSpinner: any;
    try {
        mainSpinner = ora(chalk.blue('Preparing project deletion...')).start();
        const projectToDelete = await selectProjectInteractive('❌ Select a project to delete:', projectService, displayService);

        if (!projectToDelete) {
            if(mainSpinner.isSpinning) mainSpinner.info(chalk.yellow("Delete operation cancelled or no project selected."));
            return;
        }
        mainSpinner.stop();

        console.log(chalk.yellowBright(`\n⚠️ Deleting Project: ${projectToDelete.name} (${projectToDelete.id.substring(0,8)})`));
        const { confirm } = await inquirer.prompt([
          { type: 'confirm', name: 'confirm', message: `Are you sure you want to PERMANENTLY delete project "${chalk.cyan(projectToDelete.name)}" and ALL its tasks? This action cannot be undone.`, default: false }
        ]);

        if (confirm) {
          const spinnerDelete = ora(chalk.blue(`Deleting project "${projectToDelete.name}"...`)).start();
          const success = projectService.deleteProject(projectToDelete.id);
          if (success) {
            spinnerDelete.succeed(chalk.green(`✅ Project "${projectToDelete.name}" and its tasks deleted successfully.`));
          } else {
            spinnerDelete.fail(chalk.red('❗ Failed to delete project.'));
          }
        } else {
          displayService.displayMessage('Project deletion cancelled by user.', 'info');
        }

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red(`❗ Error during project deletion: ${message}`));
        } else {
            displayService.displayMessage(`❗ Error during project deletion: ${message}`, 'error');
        }
    }
};