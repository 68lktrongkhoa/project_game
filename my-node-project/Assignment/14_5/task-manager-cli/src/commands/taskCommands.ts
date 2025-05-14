// src/commands/taskCommands.ts
import inquirer from 'inquirer';
import chalk from 'chalk';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, CreateTaskInput } from '../services/taskService';
import { getAllProjects, getProjectById } from '../services/projectService';
import { displayTasks, displayTaskDetails } from '../services/displayService';
import { TaskStatus, TaskPriority, TaskType, Project, Task } from '../types';
import { format, parseISO, isValid, parse } from 'date-fns';

// Dynamic import ora
let ora: any;
async function loadOra() { if (!ora) ora = (await import('ora')).default; }

/**
 * Parses various date input formats into an ISO string or returns undefined/error string.
 * @param input The date string from user input.
 * @returns ISO date string, undefined, or 'invalid_date'.
 */
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
    // Try direct parsing as a last resort
    parsedDate = new Date(input);
    if (isValid(parsedDate)) {
        return parsedDate.toISOString();
    }
    return 'invalid_date'; // Flag for invalid date
};

/**
 * Helper function for user to select a project for a task.
 * @param message The prompt message.
 * @returns Selected Project object or undefined.
 */
async function selectProjectForTask(message: string): Promise<Project | undefined> {
    // No spinner here, as it's usually part of a larger command's spinner context
    const projects = getAllProjects(); // Assumed synchronous
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

/**
 * Helper function for user to select a task.
 * @param message The prompt message.
 * @param projectId Optional project ID to filter tasks.
 * @returns Selected Task object or undefined.
 */
async function selectTask(message: string, projectId?: string): Promise<Task | undefined> {
    await loadOra();
    const spinner = ora(chalk.blue('Fetching task list...')).start();
    const tasks = getAllTasks(projectId); // Assumed synchronous
    const allProjects = getAllProjects(); // For displaying project names
    spinner.stop(); // Stop spinner before inquirer prompt

    if (tasks.length === 0) {
        const projectContextMsg = projectId ? `in project "${getProjectById(projectId)?.name || projectId}"` : ``;
        console.log(chalk.yellow(`ℹ️ No tasks available ${projectContextMsg}. Create one first!`));
        return undefined;
    }

    const { taskId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'taskId',
            message: message,
            choices: tasks.map(t => {
                const proj = allProjects.find(p => p.id === t.projectId);
                const projName = proj ? ` (Project: ${chalk.cyan(proj.name)})` : ` (Project ID: ${t.projectId.substring(0,8)})`;
                return { name: `${t.title} (${t.id.substring(0, 8)})${projName}`, value: t.id };
            }),
            pageSize: 15, // More tasks might be listed
        },
    ]);
    return tasks.find(t => t.id === taskId);
}

/**
 * Command to add a new task.
 * @param projectIdPrefix Optional prefix of the project ID to add the task to.
 */
export const addTaskCommand = async (projectIdPrefix?: string) => {
    await loadOra();
    let spinner: any; // Declare spinner for access in catch block
    try {
        console.log(chalk.bold.cyan('\n✨ Creating a New Task ✨'));
        let selectedProject: Project | undefined;

        const initialSpinner = ora(chalk.blue('Preparing to add task...')).start();

        if (projectIdPrefix) {
            initialSpinner.text = chalk.blue(`Fetching project "${projectIdPrefix}"...`);
            selectedProject = getProjectById(projectIdPrefix);
            if (!selectedProject) {
                initialSpinner.fail(chalk.red(`❗ Project with ID or prefix "${projectIdPrefix}" not found. Cannot add task.`));
                return;
            }
            initialSpinner.succeed(chalk.green(`Project "${selectedProject.name}" selected.`));
            console.log(chalk.blue(`Adding task to project: ${selectedProject.name} (${selectedProject.id.substring(0,8)})`));
        } else {
            initialSpinner.stop(); // Stop before selectProjectForTask prompt
            selectedProject = await selectProjectForTask('➕ Select project for the new task:');
        }

        if (!selectedProject) {
            // selectProjectForTask already logs "No projects available"
            if (!projectIdPrefix) console.log(chalk.yellow("ℹ️ Task creation cancelled as no project was selected."));
            return;
        }

        // Now prompt for task details
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
            { type: 'input', name: 'assignee', message: 'Assignee (optional):' },
            {
                type: 'input',
                name: 'deadline',
                message: 'Deadline (YYYY-MM-DD, MM/DD/YYYY, etc. Optional, type "none" to skip):',
                filter: (input: string) => input.trim().toLowerCase(),
                validate: (input: string) => {
                    if (input === 'none' || input === '') return true;
                    const parsed = parseDeadlineInput(input);
                    return parsed !== 'invalid_date' || 'Invalid date format. Use YYYY-MM-DD, etc., or type "none".';
                }
            },
        ]);

        const deadlineISO = parseDeadlineInput(answers.deadline);

        const taskInput: CreateTaskInput = {
            projectId: selectedProject.id, // Use full ID
            title: answers.title,
            description: answers.description || undefined,
            type: answers.type,
            priority: answers.priority,
            assignee: answers.assignee || undefined,
            deadline: deadlineISO === 'invalid_date' ? undefined : deadlineISO,
        };

        spinner = ora(chalk.blue('Saving task...')).start();
        const task = createTask(taskInput); // Assumed synchronous
        if (task) {
            spinner.succeed(chalk.green(`✅ Task "${task.title}" created successfully in project "${selectedProject.name}".`));
        } else {
            // This case implies createTask itself returned null, e.g., if project ID became invalid somehow
            spinner.fail(chalk.red('❗ Failed to create task. Please check project validity.'));
        }
    } catch (error: any) {
        if (spinner && spinner.isSpinning) {
            spinner.fail(chalk.red('❗ Error during task creation.'));
        } else {
            console.error(chalk.red('❗ Error during task creation.'));
        }
        console.error(chalk.red(error.message || 'An unknown error occurred during task creation.'));
    }
};

/**
 * Command to list tasks.
 * @param projectIdPrefix Optional project ID/prefix to filter tasks.
 */
export const listTasksCommand = async (projectIdPrefix?: string) => {
    await loadOra();
    const spinner = ora(chalk.blue('Loading tasks...')).start();
    try {
        let tasksToDisplay: Task[];
        let currentProject: Project | undefined;
        const allProjectsData = getAllProjects(); // Get all projects for context

        if (projectIdPrefix) {
            currentProject = getProjectById(projectIdPrefix);
            if (!currentProject) {
                spinner.fail(chalk.red(`❗ Project with ID or prefix "${projectIdPrefix}" not found.`));
                return;
            }
            spinner.text = chalk.blue(`Loading tasks for project: ${currentProject.name}...`);
            tasksToDisplay = getAllTasks(currentProject.id); // Filter by full project ID
        } else {
            tasksToDisplay = getAllTasks();
        }

        if (tasksToDisplay.length === 0) {
            const contextMsg = currentProject ? `for project "${currentProject.name}"` : "across all projects";
            spinner.info(chalk.yellow(`ℹ️ No tasks found ${contextMsg}.`));
        } else {
            spinner.succeed(chalk.green("Tasks loaded!"));
            if (currentProject) {
                console.log(chalk.blue(`\n--- 📝 Tasks for Project: ${chalk.cyan(currentProject.name)} ---`));
            }
            displayTasks(tasksToDisplay, !projectIdPrefix, allProjectsData); // Assumed synchronous display
        }
    } catch (error: any) {
        spinner.fail(chalk.red('❗ Failed to load tasks.'));
        console.error(chalk.red(error.message || 'An unknown error occurred while loading tasks.'));
    }
};

/**
 * Command to view details of a specific task.
 * @param taskIdPrefix Optional prefix of the task ID.
 */
export const viewTaskCommand = async (taskIdPrefix?: string) => {
    await loadOra();
    let mainSpinner: any;
    try {
        let taskToView: Task | undefined;
        mainSpinner = ora(chalk.blue('Processing task view...')).start();

        if (taskIdPrefix) {
            mainSpinner.text = chalk.blue(`Fetching task "${taskIdPrefix}"...`);
            taskToView = getTaskById(taskIdPrefix);
        } else {
            mainSpinner.stop();
            taskToView = await selectTask('👁️ Select a task to view:');
            if (taskToView) mainSpinner.start(chalk.blue('Loading task details...'));
        }

        if (taskToView) {
            const project = getProjectById(taskToView.projectId); // For context
            mainSpinner.succeed(chalk.green('Task details loaded!'));
            displayTaskDetails(taskToView, project); // Assumed synchronous display
        } else if (taskIdPrefix) {
            mainSpinner.fail(chalk.red(`❗ Task with ID or prefix "${taskIdPrefix}" not found.`));
        } else if (!taskToView && !mainSpinner.isSpinning) {
            // selectTask already logged if no tasks
        } else if (mainSpinner.isSpinning) {
            mainSpinner.info(chalk.yellow("View operation cancelled or no task selected."));
        }

    } catch (error: any) {
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red('❗ Error viewing task.'));
        } else {
            console.error(chalk.red('❗ Error viewing task.'));
        }
        console.error(chalk.red(error.message || 'An unknown error occurred while viewing the task.'));
    }
};

/**
 * Command to update an existing task.
 * @param taskIdPrefix Optional prefix of the task ID.
 */
export const updateTaskCommand = async (taskIdPrefix?: string) => {
    await loadOra();
    let mainSpinner: any;
    try {
        let taskToUpdate: Task | undefined;
        mainSpinner = ora(chalk.blue('Preparing task update...')).start();

        if (taskIdPrefix) {
            mainSpinner.text = chalk.blue(`Fetching task "${taskIdPrefix}" for update...`);
            taskToUpdate = getTaskById(taskIdPrefix);
        } else {
            mainSpinner.stop();
            taskToUpdate = await selectTask('✏️ Select a task to update:');
            if (taskToUpdate) mainSpinner.start(chalk.blue('Task selected. Proceeding with update...'));
        }

        if (!taskToUpdate) {
            if (taskIdPrefix) {
                mainSpinner.fail(chalk.red(`❗ Task with ID or prefix "${taskIdPrefix}" not found for update.`));
            } else if (!mainSpinner.isSpinning) {
                // selectTask already logged
            } else {
                mainSpinner.info(chalk.yellow("Update operation cancelled or no task selected."));
            }
            return;
        }

        mainSpinner.stop(); // Stop before inquirer prompts for updates
        const project = getProjectById(taskToUpdate.projectId);
        console.log(chalk.blue(`\n✏️ Updating task: ${taskToUpdate.title} (${taskToUpdate.id.substring(0,8)})`));
        if (project) console.log(chalk.blue(`   In project: ${project.name}`));

        const answers = await inquirer.prompt([
            // ... (các câu hỏi inquirer, có thể thêm current value như projectCommands) ...
            { type: 'input', name: 'title', message: `New task title (current: ${taskToUpdate.title}):`, default: taskToUpdate.title },
            { type: 'input', name: 'description', message: `New task description (current: ${taskToUpdate.description || 'N/A'}, "clear" to remove):`, default: taskToUpdate.description || '' },
            { type: 'list', name: 'status', message: 'New task status:', choices: Object.values(TaskStatus), default: taskToUpdate.status },
            { type: 'list', name: 'priority', message: 'New task priority:', choices: Object.values(TaskPriority), default: taskToUpdate.priority },
            { type: 'list', name: 'type', message: 'New task type:', choices: Object.values(TaskType), default: taskToUpdate.type },
            { type: 'input', name: 'assignee', message: `New assignee (current: ${taskToUpdate.assignee || 'N/A'}, "clear" to remove):`, default: taskToUpdate.assignee || '' },
            {
                type: 'input',
                name: 'deadline',
                message: `New deadline (current: ${taskToUpdate.deadline ? format(parseISO(taskToUpdate.deadline), 'yyyy-MM-dd') : 'N/A'}, "clear" to remove):`,
                default: taskToUpdate.deadline ? format(parseISO(taskToUpdate.deadline), 'yyyy-MM-dd') : '',
                validate: (input: string) => { /* ... validation ... */ return true; }
            },
        ]);

        const updates: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>> = {};
        // ... (logic xây dựng object `updates` không đổi nhiều) ...
        if (answers.title.trim() && answers.title.trim() !== taskToUpdate.title) updates.title = answers.title.trim();

        if (answers.description.toLowerCase() === 'clear') {
            if(taskToUpdate.description !== undefined) updates.description = undefined;
        } else if (answers.description !== (taskToUpdate.description || '')) {
            updates.description = answers.description || undefined;
        }

        if (answers.status !== taskToUpdate.status) updates.status = answers.status;
        if (answers.priority !== taskToUpdate.priority) updates.priority = answers.priority;
        if (answers.type !== taskToUpdate.type) updates.type = answers.type;

        if (answers.assignee.toLowerCase() === 'clear') {
            if(taskToUpdate.assignee !== undefined) updates.assignee = undefined;
        } else if (answers.assignee !== (taskToUpdate.assignee || '')) {
            updates.assignee = answers.assignee || undefined;
        }

        if (answers.deadline.toLowerCase() === 'clear') {
            if(taskToUpdate.deadline !== undefined) updates.deadline = undefined;
        } else if (answers.deadline && answers.deadline !== (taskToUpdate.deadline ? format(parseISO(taskToUpdate.deadline), 'yyyy-MM-dd') : '')) {
            const newDeadlineISO = parseDeadlineInput(answers.deadline);
            if (newDeadlineISO && newDeadlineISO !== 'invalid_date') {
                updates.deadline = newDeadlineISO;
            } else if (newDeadlineISO === 'invalid_date'){
                console.log(chalk.yellow("⚠️ Invalid deadline format entered, deadline not updated."));
            }
        }


        if (Object.keys(updates).length > 0) {
            const spinnerUpdate = ora(chalk.blue('Saving task changes...')).start();
            const updated = updateTask(taskToUpdate.id, updates); // Assumed synchronous
            if (updated) {
                spinnerUpdate.succeed(chalk.green(`✅ Task "${updated.title}" updated successfully.`));
                const updatedProjectCtx = getProjectById(updated.projectId);
                displayTaskDetails(updated, updatedProjectCtx); // Assumed synchronous
            } else {
                spinnerUpdate.fail(chalk.red('❗ Failed to update task. It might not exist or an issue occurred.'));
            }
        } else {
            console.log(chalk.yellow('ℹ️ No changes were made to the task.'));
        }

    } catch (error: any) {
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red('❗ Error during task update process.'));
        } else {
            console.error(chalk.red('❗ Error during task update process.'));
        }
        console.error(chalk.red(error.message || 'An unknown error occurred during task update.'));
    }
};

/**
 * Command to delete a task.
 * @param taskIdPrefix Optional prefix of the task ID.
 */
export const deleteTaskCommand = async (taskIdPrefix?: string) => {
    await loadOra();
    let mainSpinner: any;
    try {
        let taskToDelete: Task | undefined;
        mainSpinner = ora(chalk.blue('Preparing task deletion...')).start();

        if (taskIdPrefix) {
            mainSpinner.text = chalk.blue(`Fetching task "${taskIdPrefix}" for deletion...`);
            taskToDelete = getTaskById(taskIdPrefix);
        } else {
            mainSpinner.stop();
            taskToDelete = await selectTask('❌ Select a task to delete:');
            if (taskToDelete) mainSpinner.start(chalk.blue('Task selected. Proceeding with deletion...'));
        }

        if (!taskToDelete) {
            if (taskIdPrefix) {
                mainSpinner.fail(chalk.red(`❗ Task with ID or prefix "${taskIdPrefix}" not found for deletion.`));
            } else if (!mainSpinner.isSpinning) {
                // selectTask already logged
            } else {
                mainSpinner.info(chalk.yellow("Delete operation cancelled or no task selected."));
            }
            return;
        }

        mainSpinner.stop(); // Stop before confirmation prompt
        console.log(chalk.yellowBright(`\n⚠️ Deleting Task: ${taskToDelete.title} (${taskToDelete.id.substring(0,8)})`));
        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: `Are you sure you want to PERMANENTLY delete task "${chalk.cyan(taskToDelete.title)}"? This action cannot be undone.`, default: false }
        ]);

        if (confirm) {
            const spinnerDelete = ora(chalk.blue(`Deleting task "${taskToDelete.title}"...`)).start();
            const success = deleteTask(taskToDelete.id); // Assumed synchronous
            if (success) {
                spinnerDelete.succeed(chalk.green(`✅ Task "${taskToDelete.title}" deleted successfully.`));
            } else {
                spinnerDelete.fail(chalk.red('❗ Failed to delete task. It might have been already deleted or an issue occurred.'));
            }
        } else {
            console.log(chalk.yellow('ℹ️ Task deletion cancelled by user.'));
        }

    } catch (error: any) {
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk.red('❗ Error during task deletion process.'));
        } else {
            console.error(chalk.red('❗ Error during task deletion process.'));
        }
        console.error(chalk.red(error.message || 'An unknown error occurred during task deletion.'));
    }
};