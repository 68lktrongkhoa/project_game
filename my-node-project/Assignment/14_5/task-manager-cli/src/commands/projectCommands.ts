import inquirer from 'inquirer';
import chalk from 'chalk';
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from '../services/projectService';
import { getAllTasks } from '../services/taskService';
import { displayProjects, displayProjectDetails } from '../services/displayService';
import { ProjectStatus, Project } from '../types'; 

async function selectProject(message: string): Promise<Project | undefined> {
    const projects = getAllProjects();
    if (projects.length === 0) {
        console.log(chalk.yellow("No projects available. Please create a project first."));
        return undefined;
    }
    const { projectId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'projectId',
            message: message,
            choices: projects.map(p => ({ name: `${p.name} (${p.id.substring(0, 8)})`, value: p.id })),
        },
    ]);
    return projects.find(p => p.id === projectId);
}


export const addProjectCommand = async () => {
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
  const project = createProject(answers.name, answers.description);
  console.log(chalk.green(`Project "${project.name}" created with ID ${chalk.yellow(project.id.substring(0,8))}.`));
};

export const listProjectsCommand = () => {
  const projects = getAllProjects();
  displayProjects(projects);
};

export const viewProjectCommand = async (projectIdPrefix?: string) => {
    let projectToView: Project | undefined;
    if (projectIdPrefix) {
        projectToView = getProjectById(projectIdPrefix);
    } else {
        projectToView = await selectProject('Select a project to view:');
    }

    if (projectToView) {
        const tasks = getAllTasks(projectToView.id); // Lấy task bằng ID đầy đủ của project
        displayProjectDetails(projectToView, tasks);
    } else if (projectIdPrefix) { // Chỉ báo lỗi nếu prefix được cung cấp nhưng không tìm thấy
        console.log(chalk.red(`Project with ID or prefix "${projectIdPrefix}" not found.`));
    }
    // Nếu không có prefix và selectProject trả về undefined (do không có project), thông báo đã được selectProject xử lý.
};

export const updateProjectCommand = async (projectIdPrefix?: string) => {
    let projectToUpdate: Project | undefined;
    if (projectIdPrefix) {
        projectToUpdate = getProjectById(projectIdPrefix);
    } else {
        projectToUpdate = await selectProject('Select a project to update:');
    }

    if (!projectToUpdate) {
        if (projectIdPrefix) {
            console.log(chalk.red(`Project with ID or prefix "${projectIdPrefix}" not found for update.`));
        }
        return;
    }

    console.log(chalk.blue(`\nUpdating project: ${projectToUpdate.name} (${projectToUpdate.id.substring(0,8)})`));
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
        const updated = updateProject(projectToUpdate.id, updates);
        if (updated) {
            console.log(chalk.green(`Project "${updated.name}" updated.`));
            displayProjectDetails(updated, getAllTasks(updated.id));
        } else {
            console.log(chalk.red('Failed to update project.'));
        }
    } else {
        console.log(chalk.yellow('No changes made to the project.'));
    }
};

export const deleteProjectCommand = async (projectIdPrefix?: string) => {
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

    const { confirm } = await inquirer.prompt([
        { type: 'confirm', name: 'confirm', message: `Are you sure you want to delete project "${chalk.cyan(projectToDelete.name)}" (${projectToDelete.id.substring(0,8)}) and ALL its tasks? This cannot be undone.`, default: false }
    ]);

    if (confirm) {
        if (deleteProject(projectToDelete.id)) {
            console.log(chalk.green(`Project "${projectToDelete.name}" and its tasks deleted.`));
        } else {
            console.log(chalk.red('Failed to delete project.'));
        }
    } else {
        console.log(chalk.yellow('Project deletion cancelled.'));
    }
};