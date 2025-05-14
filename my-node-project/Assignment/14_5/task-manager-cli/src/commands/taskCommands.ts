import inquirer from 'inquirer';
import chalk from 'chalk';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, CreateTaskInput } from '../services/taskService';
import { getAllProjects, getProjectById } from '../services/projectService';
import { displayTasks, displayTaskDetails } from '../services/displayService';
import { TaskStatus, TaskPriority, TaskType, Project, Task } from '../types'; // Import Project và Task types
import { format, parseISO, isValid, parse } from 'date-fns';

let ora: any;
async function loadOra() { if (!ora) ora = (await import('ora')).default; }

const parseDeadlineInput = (input: string): string | undefined => {
    if (!input || input.trim().toLowerCase() === 'none' || input.trim() === '') {
        return undefined;
    }
    const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd-MM-yyyy', 'yyyyMMdd'];
    let parsedDate;
    for (const fmt of formats) {
        parsedDate = parse(input, fmt, new Date());
        if (isValid(parsedDate)) {
            return parsedDate.toISOString();
        }
    }
    parsedDate = new Date(input);
    if (isValid(parsedDate)) {
        return parsedDate.toISOString();
    }
    return 'invalid_date';
};
async function selectProjectForTask(message: string): Promise<Project | undefined> {
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

async function selectTask(message: string, projectId?: string): Promise<Task | undefined> {
    await loadOra();
    const spinner = ora(chalk.blue('Fetching task list...')).start();
    const tasks = getAllTasks(projectId);
    spinner.stop();
    if (tasks.length === 0) {
        const projectMsg = projectId ? `in the current project context ` : ``;
        console.log(chalk.yellow(`No tasks available ${projectMsg}. Create one first!`));
        return undefined;
    }
    const allProjects = getAllProjects(); 
    const { taskId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'taskId',
            message: message,
            choices: tasks.map(t => {
                const proj = allProjects.find(p => p.id === t.projectId);
                const projName = proj ? ` (Project: ${proj.name})` : ``;
                return { name: `${t.title} (${t.id.substring(0, 8)})${projName}`, value: t.id };
            }),
        },
    ]);
    return tasks.find(t => t.id === taskId);
    
}


export const addTaskCommand = async (projectIdPrefix?: string) => {
  await loadOra();
  let selectedProject: Project | undefined;

  if (projectIdPrefix) {
    selectedProject = getProjectById(projectIdPrefix);
    if (!selectedProject) {
        console.log(chalk.red(`Project with ID or prefix "${projectIdPrefix}" not found. Cannot add task.`));
        return;
    }
    console.log(chalk.blue(`Adding task to project: ${selectedProject.name} (${selectedProject.id.substring(0,8)})`));
  } else {
    selectedProject = await selectProjectForTask('Select project for the new task:');
  }

  if (!selectedProject) {
    console.log(chalk.yellow("Task creation cancelled as no project was selected or available."));
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Task title:',
      validate: function (input) {
        if (input.trim().length === 0) {
          return 'Task title cannot be empty.';
        }
        return true;
      }
    },
    { type: 'input', name: 'description', message: 'Task description (optional):' },
    { type: 'list', name: 'type', message: 'Task type:', choices: Object.values(TaskType), default: TaskType.Task },
    { type: 'list', name: 'priority', message: 'Task priority:', choices: Object.values(TaskPriority), default: TaskPriority.Medium },
    { type: 'input', name: 'assignee', message: 'Assignee (optional):' },
    {
      type: 'input',
      name: 'deadline',
      message: 'Deadline (YYYY-MM-DD or MM/DD/YYYY, optional, type "none" to skip):',
      filter: (input: string) => input.trim().toLowerCase(),
      validate: (input: string) => {
        if (input === 'none' || input === '') return true;
        const parsed = parseDeadlineInput(input);
        if (parsed === 'invalid_date') {
            return 'Invalid date format. Use YYYY-MM-DD, MM/DD/YYYY, or type "none".';
        }
        return true;
      }
    },
  ]);

  const deadlineISO = parseDeadlineInput(answers.deadline);

  const taskInput: CreateTaskInput = {
    projectId: selectedProject.id,
    title: answers.title,
    description: answers.description,
    type: answers.type,
    priority: answers.priority,
    assignee: answers.assignee,
    deadline: deadlineISO === 'invalid_date' ? undefined : deadlineISO,
  };
  const spinner = ora(chalk.blue('Saving task...')).start();

  const task = createTask(taskInput);
  if (task) {
    spinner.succeed(chalk.green(`✅ Task "${task.title}" created successfully in project "${selectedProject.name}".`));
  } else {
    spinner.fail(chalk.red('❗ Failed to create task.'));
  }
};

export const listTasksCommand = async (projectIdPrefix?: string) => {
  let tasksToDisplay;
  let currentProject: Project | undefined;
  const allProjects = getAllProjects();

  if (projectIdPrefix) {
    currentProject = getProjectById(projectIdPrefix);
    if (!currentProject) {
        console.log(chalk.red(`Project with ID or prefix "${projectIdPrefix}" not found.`));
        return;
    }
    tasksToDisplay = getAllTasks(currentProject.id);
    console.log(chalk.blue(`\n--- Tasks for Project: ${chalk.cyan(currentProject.name)} ---`));
  } else {
    tasksToDisplay = getAllTasks();
  }
  displayTasks(tasksToDisplay, !projectIdPrefix, allProjects);
  
};

export const viewTaskCommand = async (taskIdPrefix?: string) => {
    let taskToView: Task | undefined;
    if (taskIdPrefix) {
        taskToView = getTaskById(taskIdPrefix);
    } else {
        taskToView = await selectTask('Select a task to view:');
    }

    if (taskToView) {
        const project = getProjectById(taskToView.projectId);
        displayTaskDetails(taskToView, project);
    } else if (taskIdPrefix) {
        console.log(chalk.red(`Task with ID or prefix "${taskIdPrefix}" not found.`));
    }
};

export const updateTaskCommand = async (taskIdPrefix?: string) => {
    let taskToUpdate: Task | undefined;
    if (taskIdPrefix) {
        taskToUpdate = getTaskById(taskIdPrefix);
    } else {
        taskToUpdate = await selectTask('Select a task to update:');
    }

    if (!taskToUpdate) {
        if (taskIdPrefix) {
            console.log(chalk.red(`Task with ID or prefix "${taskIdPrefix}" not found for update.`));
        }
        return;
    }

    const project = getProjectById(taskToUpdate.projectId);
    console.log(chalk.blue(`\nUpdating task: ${taskToUpdate.title} (${taskToUpdate.id.substring(0,8)})`));
    if (project) console.log(chalk.blue(`In project: ${project.name}`));


    const answers = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'New task title (leave blank to keep current):', default: taskToUpdate.title },
        { type: 'input', name: 'description', message: 'New task description (leave blank to keep current, "clear" to remove):', default: taskToUpdate.description || '' },
        { type: 'list', name: 'status', message: 'New task status:', choices: Object.values(TaskStatus), default: taskToUpdate.status },
        { type: 'list', name: 'priority', message: 'New task priority:', choices: Object.values(TaskPriority), default: taskToUpdate.priority },
        { type: 'list', name: 'type', message: 'New task type:', choices: Object.values(TaskType), default: taskToUpdate.type },
        { type: 'input', name: 'assignee', message: 'New assignee (leave blank to keep current, "clear" to remove):', default: taskToUpdate.assignee || '' },
        {
            type: 'input',
            name: 'deadline',
            message: 'New deadline (YYYY-MM-DD, "clear" to remove, blank to keep current):',
            default: taskToUpdate.deadline ? format(parseISO(taskToUpdate.deadline), 'yyyy-MM-dd') : '',
            validate: (input: string) => {
                if (input.toLowerCase() === 'clear' || input === '') return true;
                const parsed = parseDeadlineInput(input);
                if (parsed === 'invalid_date') {
                    return 'Invalid date format. Use YYYY-MM-DD, MM/DD/YYYY, "clear", or leave blank.';
                }
                return true;
            }
        },
    ]);

    const updates: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>> = {};
    if (answers.title && answers.title !== taskToUpdate.title) updates.title = answers.title;

    if (answers.description.toLowerCase() === 'clear') {
        updates.description = undefined;
    } else if (answers.description !== (taskToUpdate.description || '')) {
        updates.description = answers.description || undefined;
    }

    if (answers.status !== taskToUpdate.status) updates.status = answers.status;
    if (answers.priority !== taskToUpdate.priority) updates.priority = answers.priority;
    if (answers.type !== taskToUpdate.type) updates.type = answers.type;

    if (answers.assignee.toLowerCase() === 'clear') {
        updates.assignee = undefined;
    } else if (answers.assignee !== (taskToUpdate.assignee || '')) {
        updates.assignee = answers.assignee || undefined;
    }

    if (answers.deadline.toLowerCase() === 'clear') {
        updates.deadline = undefined;
    } else if (answers.deadline) { // Chỉ xử lý nếu có giá trị mới
        const newDeadlineISO = parseDeadlineInput(answers.deadline);
        if (newDeadlineISO && newDeadlineISO !== 'invalid_date' && newDeadlineISO !== taskToUpdate.deadline) {
            updates.deadline = newDeadlineISO;
        }
    } // Nếu answers.deadline rỗng, không làm gì, giữ nguyên giá trị cũ (nếu có)

    if (Object.keys(updates).length > 0) {
        const updated = updateTask(taskToUpdate.id, updates);
        if (updated) {
            console.log(chalk.green(`Task "${updated.title}" updated.`));
            const updatedProject = getProjectById(updated.projectId);
            displayTaskDetails(updated, updatedProject);
        } else {
            console.log(chalk.red('Failed to update task.'));
        }
    } else {
        console.log(chalk.yellow('No changes made to the task.'));
    }
};

export const deleteTaskCommand = async (taskIdPrefix?: string) => {
    let taskToDelete: Task | undefined;
    if (taskIdPrefix) {
        taskToDelete = getTaskById(taskIdPrefix);
    } else {
        taskToDelete = await selectTask('Select a task to delete:');
    }

    if (!taskToDelete) {
        if (taskIdPrefix) {
            console.log(chalk.red(`Task with ID or prefix "${taskIdPrefix}" not found for deletion.`));
        }
        return;
    }

    const { confirm } = await inquirer.prompt([
        { type: 'confirm', name: 'confirm', message: `Are you sure you want to delete task "${chalk.yellowBright(taskToDelete.title)}"? This cannot be undone.`, default: false }
    ]);

    if (confirm) {
        if (deleteTask(taskToDelete.id)) {
            console.log(chalk.green(`Task "${taskToDelete.title}" deleted.`));
        } else {
            console.log(chalk.red('Failed to delete task.'));
        }
    } else {
        console.log(chalk.yellow('Task deletion cancelled.'));
    }
};