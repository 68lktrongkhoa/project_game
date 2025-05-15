import inquirer from 'inquirer';
import chalk from 'chalk';
import { format, isValid, parse } from 'date-fns';

import { TaskService, CreateTaskInput } from '../services/taskService';
import { ProjectService } from '../services/projectService';
import { DisplayService } from '../services/displayService';
import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { TaskPriority, TaskStatus, TaskType } from '../types/enums/task.enums';

let oraInstance: any;

async function loadOra() {
    if (!oraInstance) {
        const oraModule = await import('ora');
        oraInstance = oraModule.default;
    }
    return oraInstance;
}

interface BaseTaskCommandDeps {
    taskService: TaskService;
    projectService: ProjectService;
    displayService: DisplayService;
}

interface ListTasksCommandDeps extends BaseTaskCommandDeps {
    projectId?: string;
}

interface DeleteTaskCommandDeps {
    taskService: TaskService;
    projectService: ProjectService;
    displayService: DisplayService;
}


const parseDeadlineInputInternal = (input: string): string | undefined | 'invalid_date' => {
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
    try {
        parsedDate = new Date(input);
        if (isValid(parsedDate)) {
            return parsedDate.toISOString();
        }
    } catch (e) { 
        console.log("Lỗi input", e)
     }

    return 'invalid_date';
};


async function selectProjectForTaskInteractive(
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

async function selectTaskInteractive(
    message: string,
    taskService: TaskService,
    projectService: ProjectService,
    displayService: DisplayService,
    filterByProjectId?: string
): Promise<Task | undefined> {
    const ora = await loadOra();
    const spinner = ora(chalk.blue('Fetching task list...')).start();
    const tasks = filterByProjectId ? taskService.getAllTasks(filterByProjectId) : taskService.getAllTasks();
    spinner.stop();

    if (tasks.length === 0) {
        let projectContextMsg = "";
        if (filterByProjectId) {
            const project = projectService.getProjectById(filterByProjectId);
            projectContextMsg = project ? `in project "${project.name}"` : `for project ID "${filterByProjectId}"`;
        }
        displayService.displayMessage(`No tasks available ${projectContextMsg}. Create one first!`, "info");
        return undefined;
    }

    const { taskId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'taskId',
            message: message,
            choices: tasks.map(t => {
                const proj = projectService.getProjectById(t.projectId);
                const projName = proj ? ` (Project: ${chalk.cyan(proj.name)})` : ` (Project ID: ${t.projectId.substring(0,8)})`;
                return { name: `${t.title} (${t.id.substring(0, 8)})${projName}`, value: t.id };
            }),
            pageSize: 15,
        },
    ]);
    return taskService.getTaskById(taskId as string);
}

export const addTaskCommand = async (deps: BaseTaskCommandDeps) => {
    const { taskService, projectService, displayService } = deps;
    const ora = await loadOra();
    let spinner: any;
    try {
        console.log(chalk.bold.cyan('\n✨ Creating a New Task ✨'));
        const initialSpinner = ora(chalk.blue('Preparing to add task...')).start();
        initialSpinner.stop();

        const selectedProject = await selectProjectForTaskInteractive('➕ Select project for the new task:', projectService, displayService);

        if (!selectedProject) {
            return;
        }
        displayService.displayMessage(`Adding task to project: ${selectedProject.name} (${selectedProject.id.substring(0,8)})`, "info");


        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Task title:',
                validate: (input: string) => input.trim().length > 0 || 'Task title cannot be empty.',
            },
            { type: 'input', name: 'description', message: 'Task description (optional):' },
            { type: 'list', name: 'type', message: 'Task type:', choices: Object.values(TaskType), default: TaskType.Task },
            { type: 'list', name: 'priority', message: 'Task priority:', choices: Object.values(TaskPriority), default: TaskPriority.Medium },
            { type: 'input', name: 'assignee', message: 'Assignee (optional, enter to skip):' },
            {
                type: 'input',
                name: 'deadline',
                message: 'Deadline (YYYY-MM-DD, MM/DD/YYYY, etc. Optional, type "none" or leave empty to skip):',
                filter: (input: string) => input.trim().toLowerCase(),
                validate: (input: string) => {
                    if (input === 'none' || input === '') return true;
                    const parsed = parseDeadlineInputInternal(input);
                    return parsed !== 'invalid_date' || 'Invalid date format. Use YYYY-MM-DD, etc., or "none".';
                }
            },
        ]);

        const deadlineISO = parseDeadlineInputInternal(answers.deadline);

        const taskInput: CreateTaskInput = {
            projectId: selectedProject.id,
            title: answers.title,
            description: answers.description || undefined,
            type: answers.type as TaskType,
            priority: answers.priority as TaskPriority,
            assignee: answers.assignee || undefined,
            deadline: deadlineISO === 'invalid_date' ? undefined : deadlineISO,
        };

        spinner = ora(chalk.blue('Saving task...')).start();
        const task = taskService.createTask(taskInput);
        if (task) {
            spinner.succeed(chalk.green(`✅ Task "${task.title}" created successfully in project "${selectedProject.name}".`));
            displayService.displayTaskDetails(task, selectedProject);
        } else {
            spinner.fail(chalk.red('❗ Failed to create task. Project might be invalid or another issue occurred.'));
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (spinner && spinner.isSpinning) {
            spinner.fail(chalk.red(`❗ Error during task creation: ${message}`));
        } else {
            displayService.displayMessage(`❗ Error during task creation: ${message}`, 'error');
        }
    }
};

export const listTasksCommand = async (deps: ListTasksCommandDeps) => {
    const { taskService, projectService, displayService, projectId } = deps;
    const ora = await loadOra();
    const spinner = ora(chalk.blue('Loading tasks...')).start();
    try {
        let tasksToDisplay: Task[];
        let currentProject: Project | undefined;
        const allProjectsData = projectService.getAllProjects();

        if (projectId) {
            currentProject = projectService.getProjectById(projectId);
            if (!currentProject) {
                spinner.fail(chalk.red(`❗ Project with ID or prefix "${projectId}" not found.`));
                return;
            }
            spinner.text = chalk.blue(`Loading tasks for project: ${currentProject.name}...`);
            tasksToDisplay = taskService.getAllTasks(currentProject.id);
        } else {
            tasksToDisplay = taskService.getAllTasks();
        }

        if (tasksToDisplay.length === 0) {
            const contextMsg = currentProject ? `for project "${currentProject.name}"` : "across all projects";
            spinner.info(chalk.yellow(`ℹ️ No tasks found ${contextMsg}.`));
        } else {
            spinner.succeed(chalk.green("Tasks loaded!"));
            if (currentProject) {
                console.log(chalk.blue(`\n--- 📝 Tasks for Project: ${chalk.cyan(currentProject.name)} ---`));
            }
            displayService.displayTasks(tasksToDisplay, !projectId, allProjectsData);
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        spinner.fail(chalk.red(`❗ Failed to load tasks: ${message}`));
    }
};

export const viewTaskCommand = async (deps: BaseTaskCommandDeps) => {
    const { taskService, projectService, displayService } = deps;
    const ora = await loadOra();
    let mainSpinner: any;
    try {
        mainSpinner = ora(chalk.blue('Processing task view...')).start();
        mainSpinner.stop();

        const taskToView = await selectTaskInteractive('👁️ Select a task to view:', taskService, projectService, displayService);

        if (taskToView) {
            mainSpinner.start(chalk.blue('Loading task details...'));
            const project = projectService.getProjectById(taskToView.projectId);
            mainSpinner.succeed(chalk.green('Task details loaded!'));
            displayService.displayTaskDetails(taskToView, project);
        } else if (mainSpinner.isSpinning) { 
            mainSpinner.info(chalk.yellow("View operation cancelled or no task selected."));
        }

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red(`❗ Error viewing task: ${message}`));
        } else {
            displayService.displayMessage(`❗ Error viewing task: ${message}`, 'error');
        }
    }
};

export const updateTaskCommand = async (deps: BaseTaskCommandDeps) => {
    const { taskService, projectService, displayService } = deps;
    const ora = await loadOra();
    let mainSpinner: any;
    try {
        mainSpinner = ora(chalk.blue('Preparing task update...')).start();
        mainSpinner.stop();

        const taskToUpdate = await selectTaskInteractive('✏️ Select a task to update:', taskService, projectService, displayService);

        if (!taskToUpdate) {
            return;
        }

        const project = projectService.getProjectById(taskToUpdate.projectId);
        console.log(chalk.blue(`\n✏️ Updating task: ${taskToUpdate.title} (${taskToUpdate.id.substring(0,8)})`));
        if (project) console.log(chalk.blue(`   In project: ${project.name}`));

        const answers = await inquirer.prompt([
            { type: 'input', name: 'title', message: `New task title (current: ${taskToUpdate.title}):`, default: taskToUpdate.title, validate: (input: string) => input.trim().length > 0 || 'Title cannot be empty.' },
            { type: 'input', name: 'description', message: `New description (current: ${taskToUpdate.description || 'N/A'}, "clear" to remove):`, default: taskToUpdate.description || '' },
            { type: 'list', name: 'status', message: 'New status:', choices: Object.values(TaskStatus), default: taskToUpdate.status },
            { type: 'list', name: 'priority', message: 'New priority:', choices: Object.values(TaskPriority), default: taskToUpdate.priority },
            { type: 'list', name: 'type', message: 'New type:', choices: Object.values(TaskType), default: taskToUpdate.type },
            { type: 'input', name: 'assignee', message: `New assignee (current: ${taskToUpdate.assignee || 'N/A'}, "clear" to remove):`, default: taskToUpdate.assignee || '' },
            {
                type: 'input',
                name: 'deadline',
                message: `New deadline (current: ${taskToUpdate.deadline ? format(taskToUpdate.deadline, 'yyyy-MM-dd') : 'N/A'}, "clear" or empty to remove):`,
                default: taskToUpdate.deadline ? format(taskToUpdate.deadline, 'yyyy-MM-dd') : '',
                filter: (input: string) => input.trim().toLowerCase(),
                validate: (input: string) => {
                    if (input === 'clear' || input === 'none' || input === '') return true;
                    const parsed = parseDeadlineInputInternal(input);
                    return parsed !== 'invalid_date' || 'Invalid date format.';
                }
            },
        ]);

        const updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'status' | 'type' | 'assignee' | 'deadline'>> = {};

        if (answers.title.trim() !== taskToUpdate.title) updates.title = answers.title.trim();

        if (answers.description.toLowerCase() === 'clear') {
            updates.description = '';
        } else if (answers.description !== (taskToUpdate.description || '')) {
            updates.description = answers.description;
        }

        if (answers.status !== taskToUpdate.status) updates.status = answers.status as TaskStatus;
        if (answers.priority !== taskToUpdate.priority) updates.priority = answers.priority as TaskPriority;
        if (answers.type !== taskToUpdate.type) updates.type = answers.type as TaskType;

        if (answers.assignee.toLowerCase() === 'clear') {
            updates.assignee = undefined;
        } else if (answers.assignee !== (taskToUpdate.assignee || '')) {
            updates.assignee = answers.assignee || undefined;
        }

        const newDeadlineInput = answers.deadline;
        if (newDeadlineInput === 'clear' || newDeadlineInput === 'none' || newDeadlineInput === '') {
            updates.deadline = undefined;
        } else {
            const parsedDeadline = parseDeadlineInputInternal(newDeadlineInput);
            if (parsedDeadline && parsedDeadline !== 'invalid_date') {
                const currentDeadlineFormatted = taskToUpdate.deadline ? format(taskToUpdate.deadline, 'yyyy-MM-dd') : '';
                if (newDeadlineInput !== currentDeadlineFormatted) {
                     updates.deadline = new Date(parsedDeadline);
                }
            } else if (parsedDeadline === 'invalid_date') {
                displayService.displayMessage("Invalid deadline format entered, deadline not updated.", "warning");
            }
        }


        if (Object.keys(updates).length > 0) {
            const spinnerUpdate = ora(chalk.blue('Saving task changes...')).start();
            const updatedTask = taskService.updateTask(taskToUpdate.id, updates);
            if (updatedTask) {
                spinnerUpdate.succeed(chalk.green(`✅ Task "${updatedTask.title}" updated successfully.`));
                const updatedProjectCtx = projectService.getProjectById(updatedTask.projectId);
                displayService.displayTaskDetails(updatedTask, updatedProjectCtx);
            } else {
                spinnerUpdate.fail(chalk.red('❗ Failed to update task.'));
            }
        } else {
            displayService.displayMessage('No changes were made to the task.', 'info');
        }

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red(`❗ Error during task update: ${message}`));
        } else {
            displayService.displayMessage(`❗ Error during task update: ${message}`, 'error');
        }
    }
};

export const deleteTaskCommand = async (deps: DeleteTaskCommandDeps) => {
    const { taskService, displayService } = deps;
    const ora = await loadOra();
    let mainSpinner: any;
    try {
        mainSpinner = ora(chalk.blue('Preparing task deletion...')).start();
        mainSpinner.stop();

        const taskToDelete = await selectTaskInteractive(
            '❌ Select a task to delete:',
            deps.taskService,
            deps.projectService, 
            deps.displayService 
        );

        if (!taskToDelete) {
            return;
        }

        console.log(chalk.yellowBright(`\n⚠️ Deleting Task: ${taskToDelete.title} (${taskToDelete.id.substring(0,8)})`));
        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: `Are you sure you want to PERMANENTLY delete task "${chalk.cyan(taskToDelete.title)}"? This action cannot be undone.`, default: false }
        ]);

        if (confirm) {
            const spinnerDelete = ora(chalk.blue(`Deleting task "${taskToDelete.title}"...`)).start();
            const success = taskService.deleteTask(taskToDelete.id); 
            if (success) {
                spinnerDelete.succeed(chalk.green(`✅ Task "${taskToDelete.title}" deleted successfully.`));
            } else {
                spinnerDelete.fail(chalk.red('❗ Failed to delete task.'));
            }
        } else {
            displayService.displayMessage('Task deletion cancelled by user.', 'info');
        }

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red(`❗ Error during task deletion: ${message}`));
        } else {
            displayService.displayMessage(`❗ Error during task deletion: ${message}`, 'error');
        }
    }
};