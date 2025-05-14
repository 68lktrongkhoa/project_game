import inquirer from 'inquirer';
import chalk from 'chalk';
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from '../services/projectService';
import { getAllTasks } from '../services/taskService';
import { displayProjects, displayProjectDetails } from '../services/displayService';
import { ProjectStatus, Project } from '../types';

let ora: any;
async function loadOra() { if (!ora) ora = (await import('ora')).default; }

async function selectProject(message: string): Promise<Project | undefined> {
    await loadOra();
    const projects = getAllProjects();

    if (projects.length === 0) {
        console.log(chalk.yellow("ℹ️ No projects available. Please create a project first."));
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
    return projects.find(p => p.id === projectId);
}

export const addProjectCommand = async () => {
    await loadOra();
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
        const project = createProject(answers.name, answers.description);
        spinner.succeed(chalk.green(`✅ Project "${project.name}" created successfully with ID ${chalk.yellow(project.id.substring(0,8))}.`));

    } catch (error: any) {
        if (spinner && spinner.isSpinning) {
            spinner.fail(chalk.red('❗ Error during project creation.'));
        } else {
            console.error(chalk.red('❗ Error during project creation.'));
        }
        console.error(chalk.red(error.message || 'An unknown error occurred during project creation.'));
    }
};

export const listProjectsCommand = async () => {
    await loadOra();
    const spinner = ora(chalk.blue('Loading projects...')).start();
    try {
        const projects = getAllProjects(); 

        if (projects.length === 0) {
          spinner.info(chalk.yellow("ℹ️ No projects found. You can create one from the menu."));
        } else {
          spinner.succeed(chalk.green("Projects loaded!"));
          displayProjects(projects);
        }
    } catch (error: any) {
        spinner.fail(chalk.red('❗ Failed to load projects.'));
        console.error(chalk.red(error.message || 'An unknown error occurred while loading projects.'));
    }
};

export const viewProjectCommand = async (projectIdPrefix?: string) => {
    await loadOra();
    let mainSpinner: any;
    try {
        let projectToView: Project | undefined;
        mainSpinner = ora(chalk.blue('Processing project view...')).start();

        if (projectIdPrefix) {
            mainSpinner.text = chalk.blue(`Fetching project "${projectIdPrefix}"...`);
            projectToView = getProjectById(projectIdPrefix); 
        } else {
            mainSpinner.stop(); 
            projectToView = await selectProject('👁️ Select a project to view:');
            if (projectToView) mainSpinner.start(chalk.blue('Loading project details...')); 
        }

        if (projectToView) {
            mainSpinner.text = chalk.blue(`Loading tasks for project "${projectToView.name}"...`);
            const tasks = getAllTasks(projectToView.id);
            mainSpinner.succeed(chalk.green('Project and tasks loaded!'));
            displayProjectDetails(projectToView, tasks); 
        } else if (projectIdPrefix) {
            mainSpinner.fail(chalk.red(`❗ Project with ID or prefix "${projectIdPrefix}" not found.`));
        } else if (!projectToView && !mainSpinner.isSpinning) {
        } else if (mainSpinner.isSpinning){ 
            mainSpinner.info(chalk.yellow("View operation cancelled or no project found."));
        }


    } catch (error: any) {
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red('❗ Error viewing project.'));
        } else {
            console.error(chalk.red('❗ Error viewing project.'));
        }
        console.error(chalk.red(error.message || 'An unknown error occurred while viewing the project.'));
    }
};

export const updateProjectCommand = async (projectIdPrefix?: string) => {
    await loadOra();
    let mainSpinner: any;
    try {
        let projectToUpdate: Project | undefined;
        mainSpinner = ora(chalk.blue('Preparing project update...')).start();

        if (projectIdPrefix) {
            mainSpinner.text = chalk.blue(`Fetching project "${projectIdPrefix}" for update...`);
            projectToUpdate = getProjectById(projectIdPrefix);
        } else {
            mainSpinner.stop();
            projectToUpdate = await selectProject('✏️ Select a project to update:');
            if (projectToUpdate) mainSpinner.start(chalk.blue('Project selected. Proceeding with update...'));
        }

        if (!projectToUpdate) {
            if (projectIdPrefix) {
                mainSpinner.fail(chalk.red(`❗ Project with ID or prefix "${projectIdPrefix}" not found for update.`));
            } else if (!mainSpinner.isSpinning) {
                // selectProject already logged if no projects exist
            } else {
                 mainSpinner.info(chalk.yellow("Update operation cancelled or no project selected."));
            }
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
                validate: function (input: string) {
                    if (input.trim().length === 0 && input !== projectToUpdate?.name) {
                        return 'Project name cannot be empty if you intend to change it.';
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'description',
                message: `New project description (current: ${projectToUpdate.description || 'N/A'}, type "clear" to remove):`,
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

        const updates: Partial<Omit<Project, 'id' | 'createdAt'>> = {};
        if (answers.name.trim() && answers.name.trim() !== projectToUpdate.name) {
            updates.name = answers.name.trim();
        }

        if (answers.description.toLowerCase() === 'clear') {
            if (projectToUpdate.description !== undefined) updates.description = undefined;
        } else if (answers.description !== (projectToUpdate.description || '')) {
            updates.description = answers.description || undefined; 
        }

        if (answers.status !== projectToUpdate.status) {
            updates.status = answers.status;
        }

        if (Object.keys(updates).length > 0) {
            const spinnerUpdate = ora(chalk.blue('Saving changes...')).start();
            const updated = updateProject(projectToUpdate.id, updates);
            if (updated) {
                spinnerUpdate.succeed(chalk.green(`✅ Project "${updated.name}" updated successfully.`));
                displayProjectDetails(updated, getAllTasks(updated.id));
            } else {
                spinnerUpdate.fail(chalk.red('❗ Failed to update project. The project might not exist or an issue occurred.'));
            }
        } else {
            console.log(chalk.yellow('ℹ️ No changes were made to the project.'));
        }

    } catch (error: any) {
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red('❗ Error during project update process.'));
        } else {
             console.error(chalk.red('❗ Error during project update process.'));
        }
        console.error(chalk.red(error.message || 'An unknown error occurred during project update.'));
    }
};

export const deleteProjectCommand = async (projectIdPrefix?: string) => {
    await loadOra();
    let mainSpinner: any;
    try {
        let projectToDelete: Project | undefined;
        mainSpinner = ora(chalk.blue('Preparing project deletion...')).start();

        if (projectIdPrefix) {
            mainSpinner.text = chalk.blue(`Fetching project "${projectIdPrefix}" for deletion...`);
            projectToDelete = getProjectById(projectIdPrefix);
        } else {
            mainSpinner.stop();
            projectToDelete = await selectProject('❌ Select a project to delete:');
            if(projectToDelete) mainSpinner.start(chalk.blue('Project selected. Proceeding with deletion...'));
        }

        if (!projectToDelete) {
            if (projectIdPrefix) {
                mainSpinner.fail(chalk.red(`❗ Project with ID or prefix "${projectIdPrefix}" not found for deletion.`));
            } else if (!mainSpinner.isSpinning) {
            } else {
                mainSpinner.info(chalk.yellow("Delete operation cancelled or no project selected."));
            }
            return;
        }

        mainSpinner.stop(); 
        console.log(chalk.yellowBright(`\n⚠️ Deleting Project: ${projectToDelete.name} (${projectToDelete.id.substring(0,8)})`));
        const { confirm } = await inquirer.prompt([
          { type: 'confirm', name: 'confirm', message: `Are you sure you want to PERMANENTLY delete project "${chalk.cyan(projectToDelete.name)}" and ALL its tasks? This action cannot be undone.`, default: false }
        ]);

        if (confirm) {
          const spinnerDelete = ora(chalk.blue(`Deleting project "${projectToDelete.name}"...`)).start();
          const success = deleteProject(projectToDelete.id);
          if (success) {
            spinnerDelete.succeed(chalk.green(`✅ Project "${projectToDelete.name}" and its tasks deleted successfully.`));
          } else {
            spinnerDelete.fail(chalk.red('❗ Failed to delete project. It might have been already deleted or an issue occurred.'));
          }
        } else {
          console.log(chalk.yellow('ℹ️ Project deletion cancelled by user.'));
        }

    } catch (error: any) {
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red('❗ Error during project deletion process.'));
        } else {
            console.error(chalk.red('❗ Error during project deletion process.'));
        }
        console.error(chalk.red(error.message || 'An unknown error occurred during project deletion.'));
    }
};