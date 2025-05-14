import inquirer from 'inquirer';
import chalk from 'chalk';
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from '../services/projectService';
import { getAllTasks } from '../services/taskService';
import { displayProjects, displayProjectDetails } from '../services/displayService';
import { ProjectStatus, Project } from '../types'; 

let ora: any; // Khai báo ora ở đây
async function loadOra() { if (!ora) ora = (await import('ora')).default; }

async function selectProject(message: string): Promise<Project | undefined> {
    await loadOra();
    const spinner = ora(chalk.blue('Fetching project list...')).start();
    const projects = getAllProjects();
    spinner.stop();

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
    console.log(chalk.bold.cyan('\n✨ Creating a New Project ✨'));
    const answers = await inquirer.prompt([
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
    const spinner = ora(chalk.blue('Saving project...')).start();
    const project = createProject(answers.name, answers.description);
    spinner.succeed(chalk.green(`✅ Project "${project.name}" created successfully with ID ${chalk.yellow(project.id.substring(0,8))}.`));
};

export const listProjectsCommand = async () => {
    await loadOra();
    const spinner = ora(chalk.blue('Loading projects...')).start();
    const projects = getAllProjects();
    
    if (projects.length === 0) {
      spinner.info(chalk.yellow("ℹ️ No projects found."));
    } else {
      spinner.succeed(chalk.green("Projects loaded!"));
      displayProjects(projects);
    }
  };

  export const viewProjectCommand = async (projectIdPrefix?: string) => {
    await loadOra();
    let projectToView: Project | undefined;
    if (projectIdPrefix) {
      const spinner = ora(chalk.blue(`Fetching project "${projectIdPrefix}"...`)).start();
      projectToView = getProjectById(projectIdPrefix);
      spinner.stop();
    } else {
      projectToView = await selectProject('Select a project to view:');
    }
  
    if (projectToView) {
      const spinnerTasks = ora(chalk.blue(`Loading tasks for project "${projectToView.name}"...`)).start();
      const tasks = getAllTasks(projectToView.id);
      spinnerTasks.succeed(chalk.green('Tasks loaded!'));
      displayProjectDetails(projectToView, tasks);
    } else if (projectIdPrefix) {
      console.log(chalk.red(`❗ Project with ID or prefix "${projectIdPrefix}" not found.`));
    }
  };

export const updateProjectCommand = async (projectIdPrefix?: string) => {
    await loadOra();
    let projectToUpdate: Project | undefined;
    if (projectIdPrefix) {
        const spinner = ora(chalk.blue(`Fetching project "${projectIdPrefix}" for update...`)).start();
        projectToUpdate = getProjectById(projectIdPrefix);
        spinner.stop();
    } else {
        projectToUpdate = await selectProject('✏️ Select a project to update:');
    }

    if (!projectToUpdate) {
        if (projectIdPrefix) console.log(chalk.red(`❗ Project with ID or prefix "${projectIdPrefix}" not found.`));
        return;
    }

    console.log(chalk.blue(`\n✏️ Updating project: ${projectToUpdate.name} (${projectToUpdate.id.substring(0,8)})`));
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'New project name (leave blank to keep current):',
            default: projectToUpdate.name,
            validate: function (input, currentAnswers) {
              if (input.trim().length === 0 && projectToUpdate?.name === input ) {
                  return true;
              }
              if (input.trim().length === 0 && projectToUpdate?.name !== input ) {
                  return 'Project name cannot be empty if you intend to change it.';
              }
              return true;
            }
        },
        { type: 'input', name: 'description', message: 'New project description (leave blank to keep current, type "clear" to remove):', default: projectToUpdate.description || '' },
        { type: 'list', name: 'status', message: 'New project status:', choices: Object.values(ProjectStatus), default: projectToUpdate.status },
    ]);

    const updates: Partial<Omit<Project, 'id' | 'createdAt'>> = {};
    if (answers.name && answers.name !== projectToUpdate.name) updates.name = answers.name;

    if (answers.description.toLowerCase() === 'clear') {
        updates.description = undefined;
    } else if (answers.description !== (projectToUpdate.description || '')) {
        updates.description = answers.description || undefined;
    }

    if (answers.status !== projectToUpdate.status) updates.status = answers.status;

    if (Object.keys(updates).length > 0) {
        const spinnerUpdate = ora(chalk.blue('Saving changes...')).start();
        const updated = updateProject(projectToUpdate.id, updates);
        if (updated) {
            spinnerUpdate.succeed(chalk.green(`✅ Project "${updated.name}" updated successfully.`));
            displayProjectDetails(updated, getAllTasks(updated.id));
        } else {
            spinnerUpdate.fail(chalk.red('❗ Failed to update project.'));
        }
    } else {
        console.log(chalk.yellow('ℹ️ No changes made to the project.'));
    }
};

export const deleteProjectCommand = async (projectIdPrefix?: string) => {
    await loadOra();
    let projectToDelete: Project | undefined;
    if (projectIdPrefix) {
        projectToDelete = getProjectById(projectIdPrefix);
    } else {
        projectToDelete = await selectProject('Select a project to delete:');
    }

    if (!projectToDelete) {
        if (projectIdPrefix) {
            console.log(chalk.red(`Project with ID or prefix "${projectIdPrefix}" not found for deletion.`));
        }
        return;
    }

    console.log(chalk.yellowBright(`\n⚠️ Deleting Project: ${projectToDelete.name}`));
    const { confirm } = await inquirer.prompt([
      { type: 'confirm', name: 'confirm', message: `Are you sure you want to PERMANENTLY delete project "${chalk.cyan(projectToDelete.name)}" and ALL its tasks? This action cannot be undone.`, default: false }
    ]);
  
    if (confirm) {
      const spinnerDelete = ora(chalk.blue(`Deleting project "${projectToDelete.name}"...`)).start();
      if (deleteProject(projectToDelete.id)) {
        spinnerDelete.succeed(chalk.green(`✅ Project "${projectToDelete.name}" and its tasks deleted successfully.`));
      } else {
        spinnerDelete.fail(chalk.red('❗ Failed to delete project.'));
      }
    } else {
      console.log(chalk.yellow('ℹ️ Project deletion cancelled.'));
    }
};