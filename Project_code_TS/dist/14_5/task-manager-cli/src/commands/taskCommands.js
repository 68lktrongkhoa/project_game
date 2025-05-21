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
exports.deleteTaskCommand = exports.updateTaskCommand = exports.viewTaskCommand = exports.listTasksCommand = exports.addTaskCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const date_fns_1 = require("date-fns");
const task_enums_1 = require("../types/enums/task.enums");
let oraInstance;
async function loadOra() {
    if (!oraInstance) {
        const oraModule = await Promise.resolve().then(() => __importStar(require('ora')));
        oraInstance = oraModule.default;
    }
    return oraInstance;
}
const parseDeadlineInputInternal = (input) => {
    if (!input || input.trim().toLowerCase() === 'none' || input.trim() === '') {
        return undefined;
    }
    const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd-MM-yyyy', 'yyyyMMdd'];
    let parsedDate;
    for (const fmt of formats) {
        parsedDate = (0, date_fns_1.parse)(input, fmt, new Date());
        if ((0, date_fns_1.isValid)(parsedDate)) {
            return parsedDate.toISOString();
        }
    }
    try {
        parsedDate = new Date(input);
        if ((0, date_fns_1.isValid)(parsedDate)) {
            return parsedDate.toISOString();
        }
    }
    catch (e) {
        console.log("Lỗi input", e);
    }
    return 'invalid_date';
};
async function selectProjectForTaskInteractive(message, projectService, displayService) {
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
async function selectTaskInteractive(message, taskService, projectService, displayService, filterByProjectId) {
    const ora = await loadOra();
    const spinner = ora(chalk_1.default.blue('Fetching task list...')).start();
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
    const { taskId } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'taskId',
            message: message,
            choices: tasks.map(t => {
                const proj = projectService.getProjectById(t.projectId);
                const projName = proj ? ` (Project: ${chalk_1.default.cyan(proj.name)})` : ` (Project ID: ${t.projectId.substring(0, 8)})`;
                return { name: `${t.title} (${t.id.substring(0, 8)})${projName}`, value: t.id };
            }),
            pageSize: 15,
        },
    ]);
    return taskService.getTaskById(taskId);
}
const addTaskCommand = async (deps) => {
    const { taskService, projectService, displayService } = deps;
    const ora = await loadOra();
    let spinner;
    try {
        console.log(chalk_1.default.bold.cyan('\n✨ Creating a New Task ✨'));
        const initialSpinner = ora(chalk_1.default.blue('Preparing to add task...')).start();
        initialSpinner.stop();
        const selectedProject = await selectProjectForTaskInteractive('➕ Select project for the new task:', projectService, displayService);
        if (!selectedProject) {
            return;
        }
        displayService.displayMessage(`Adding task to project: ${selectedProject.name} (${selectedProject.id.substring(0, 8)})`, "info");
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Task title:',
                validate: (input) => input.trim().length > 0 || 'Task title cannot be empty.',
            },
            { type: 'input', name: 'description', message: 'Task description (optional):' },
            { type: 'list', name: 'type', message: 'Task type:', choices: Object.values(task_enums_1.TaskType), default: task_enums_1.TaskType.Task },
            { type: 'list', name: 'priority', message: 'Task priority:', choices: Object.values(task_enums_1.TaskPriority), default: task_enums_1.TaskPriority.Medium },
            { type: 'input', name: 'assignee', message: 'Assignee (optional, enter to skip):' },
            {
                type: 'input',
                name: 'deadline',
                message: 'Deadline (YYYY-MM-DD, MM/DD/YYYY, etc. Optional, type "none" or leave empty to skip):',
                filter: (input) => input.trim().toLowerCase(),
                validate: (input) => {
                    if (input === 'none' || input === '')
                        return true;
                    const parsed = parseDeadlineInputInternal(input);
                    return parsed !== 'invalid_date' || 'Invalid date format. Use YYYY-MM-DD, etc., or "none".';
                }
            },
        ]);
        const deadlineISO = parseDeadlineInputInternal(answers.deadline);
        const taskInput = {
            projectId: selectedProject.id,
            title: answers.title,
            description: answers.description || undefined,
            type: answers.type,
            priority: answers.priority,
            assignee: answers.assignee || undefined,
            deadline: deadlineISO === 'invalid_date' ? undefined : deadlineISO,
        };
        spinner = ora(chalk_1.default.blue('Saving task...')).start();
        const task = taskService.createTask(taskInput);
        if (task) {
            spinner.succeed(chalk_1.default.green(`✅ Task "${task.title}" created successfully in project "${selectedProject.name}".`));
            displayService.displayTaskDetails(task, selectedProject);
        }
        else {
            spinner.fail(chalk_1.default.red('❗ Failed to create task. Project might be invalid or another issue occurred.'));
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (spinner && spinner.isSpinning) {
            spinner.fail(chalk_1.default.red(`❗ Error during task creation: ${message}`));
        }
        else {
            displayService.displayMessage(`❗ Error during task creation: ${message}`, 'error');
        }
    }
};
exports.addTaskCommand = addTaskCommand;
const listTasksCommand = async (deps) => {
    const { taskService, projectService, displayService, projectId } = deps;
    const ora = await loadOra();
    const spinner = ora(chalk_1.default.blue('Loading tasks...')).start();
    try {
        let tasksToDisplay;
        let currentProject;
        const allProjectsData = projectService.getAllProjects();
        if (projectId) {
            currentProject = projectService.getProjectById(projectId);
            if (!currentProject) {
                spinner.fail(chalk_1.default.red(`❗ Project with ID or prefix "${projectId}" not found.`));
                return;
            }
            spinner.text = chalk_1.default.blue(`Loading tasks for project: ${currentProject.name}...`);
            tasksToDisplay = taskService.getAllTasks(currentProject.id);
        }
        else {
            tasksToDisplay = taskService.getAllTasks();
        }
        if (tasksToDisplay.length === 0) {
            const contextMsg = currentProject ? `for project "${currentProject.name}"` : "across all projects";
            spinner.info(chalk_1.default.yellow(`ℹ️ No tasks found ${contextMsg}.`));
        }
        else {
            spinner.succeed(chalk_1.default.green("Tasks loaded!"));
            if (currentProject) {
                console.log(chalk_1.default.blue(`\n--- 📝 Tasks for Project: ${chalk_1.default.cyan(currentProject.name)} ---`));
            }
            displayService.displayTasks(tasksToDisplay, !projectId, allProjectsData);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        spinner.fail(chalk_1.default.red(`❗ Failed to load tasks: ${message}`));
    }
};
exports.listTasksCommand = listTasksCommand;
const viewTaskCommand = async (deps) => {
    const { taskService, projectService, displayService } = deps;
    const ora = await loadOra();
    let mainSpinner;
    try {
        mainSpinner = ora(chalk_1.default.blue('Processing task view...')).start();
        mainSpinner.stop();
        const taskToView = await selectTaskInteractive('👁️ Select a task to view:', taskService, projectService, displayService);
        if (taskToView) {
            mainSpinner.start(chalk_1.default.blue('Loading task details...'));
            const project = projectService.getProjectById(taskToView.projectId);
            mainSpinner.succeed(chalk_1.default.green('Task details loaded!'));
            displayService.displayTaskDetails(taskToView, project);
        }
        else if (mainSpinner.isSpinning) {
            mainSpinner.info(chalk_1.default.yellow("View operation cancelled or no task selected."));
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk_1.default.red(`❗ Error viewing task: ${message}`));
        }
        else {
            displayService.displayMessage(`❗ Error viewing task: ${message}`, 'error');
        }
    }
};
exports.viewTaskCommand = viewTaskCommand;
const updateTaskCommand = async (deps) => {
    const { taskService, projectService, displayService } = deps;
    const ora = await loadOra();
    let mainSpinner;
    try {
        mainSpinner = ora(chalk_1.default.blue('Preparing task update...')).start();
        mainSpinner.stop();
        const taskToUpdate = await selectTaskInteractive('✏️ Select a task to update:', taskService, projectService, displayService);
        if (!taskToUpdate) {
            return;
        }
        const project = projectService.getProjectById(taskToUpdate.projectId);
        console.log(chalk_1.default.blue(`\n✏️ Updating task: ${taskToUpdate.title} (${taskToUpdate.id.substring(0, 8)})`));
        if (project)
            console.log(chalk_1.default.blue(`   In project: ${project.name}`));
        const answers = await inquirer_1.default.prompt([
            { type: 'input', name: 'title', message: `New task title (current: ${taskToUpdate.title}):`, default: taskToUpdate.title, validate: (input) => input.trim().length > 0 || 'Title cannot be empty.' },
            { type: 'input', name: 'description', message: `New description (current: ${taskToUpdate.description || 'N/A'}, "clear" to remove):`, default: taskToUpdate.description || '' },
            { type: 'list', name: 'status', message: 'New status:', choices: Object.values(task_enums_1.TaskStatus), default: taskToUpdate.status },
            { type: 'list', name: 'priority', message: 'New priority:', choices: Object.values(task_enums_1.TaskPriority), default: taskToUpdate.priority },
            { type: 'list', name: 'type', message: 'New type:', choices: Object.values(task_enums_1.TaskType), default: taskToUpdate.type },
            { type: 'input', name: 'assignee', message: `New assignee (current: ${taskToUpdate.assignee || 'N/A'}, "clear" to remove):`, default: taskToUpdate.assignee || '' },
            {
                type: 'input',
                name: 'deadline',
                message: `New deadline (current: ${taskToUpdate.deadline ? (0, date_fns_1.format)(taskToUpdate.deadline, 'yyyy-MM-dd') : 'N/A'}, "clear" or empty to remove):`,
                default: taskToUpdate.deadline ? (0, date_fns_1.format)(taskToUpdate.deadline, 'yyyy-MM-dd') : '',
                filter: (input) => input.trim().toLowerCase(),
                validate: (input) => {
                    if (input === 'clear' || input === 'none' || input === '')
                        return true;
                    const parsed = parseDeadlineInputInternal(input);
                    return parsed !== 'invalid_date' || 'Invalid date format.';
                }
            },
        ]);
        const updates = {};
        if (answers.title.trim() !== taskToUpdate.title)
            updates.title = answers.title.trim();
        if (answers.description.toLowerCase() === 'clear') {
            updates.description = '';
        }
        else if (answers.description !== (taskToUpdate.description || '')) {
            updates.description = answers.description;
        }
        if (answers.status !== taskToUpdate.status)
            updates.status = answers.status;
        if (answers.priority !== taskToUpdate.priority)
            updates.priority = answers.priority;
        if (answers.type !== taskToUpdate.type)
            updates.type = answers.type;
        if (answers.assignee.toLowerCase() === 'clear') {
            updates.assignee = undefined;
        }
        else if (answers.assignee !== (taskToUpdate.assignee || '')) {
            updates.assignee = answers.assignee || undefined;
        }
        const newDeadlineInput = answers.deadline;
        if (newDeadlineInput === 'clear' || newDeadlineInput === 'none' || newDeadlineInput === '') {
            updates.deadline = undefined;
        }
        else {
            const parsedDeadline = parseDeadlineInputInternal(newDeadlineInput);
            if (parsedDeadline && parsedDeadline !== 'invalid_date') {
                const currentDeadlineFormatted = taskToUpdate.deadline ? (0, date_fns_1.format)(taskToUpdate.deadline, 'yyyy-MM-dd') : '';
                if (newDeadlineInput !== currentDeadlineFormatted) {
                    updates.deadline = new Date(parsedDeadline);
                }
            }
            else if (parsedDeadline === 'invalid_date') {
                displayService.displayMessage("Invalid deadline format entered, deadline not updated.", "warning");
            }
        }
        if (Object.keys(updates).length > 0) {
            const spinnerUpdate = ora(chalk_1.default.blue('Saving task changes...')).start();
            const updatedTask = taskService.updateTask(taskToUpdate.id, updates);
            if (updatedTask) {
                spinnerUpdate.succeed(chalk_1.default.green(`✅ Task "${updatedTask.title}" updated successfully.`));
                const updatedProjectCtx = projectService.getProjectById(updatedTask.projectId);
                displayService.displayTaskDetails(updatedTask, updatedProjectCtx);
            }
            else {
                spinnerUpdate.fail(chalk_1.default.red('❗ Failed to update task.'));
            }
        }
        else {
            displayService.displayMessage('No changes were made to the task.', 'info');
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk_1.default.red(`❗ Error during task update: ${message}`));
        }
        else {
            displayService.displayMessage(`❗ Error during task update: ${message}`, 'error');
        }
    }
};
exports.updateTaskCommand = updateTaskCommand;
const deleteTaskCommand = async (deps) => {
    const { taskService, displayService } = deps;
    const ora = await loadOra();
    let mainSpinner;
    try {
        mainSpinner = ora(chalk_1.default.blue('Preparing task deletion...')).start();
        mainSpinner.stop();
        const taskToDelete = await selectTaskInteractive('❌ Select a task to delete:', deps.taskService, deps.projectService, deps.displayService);
        if (!taskToDelete) {
            return;
        }
        console.log(chalk_1.default.yellowBright(`\n⚠️ Deleting Task: ${taskToDelete.title} (${taskToDelete.id.substring(0, 8)})`));
        const { confirm } = await inquirer_1.default.prompt([
            { type: 'confirm', name: 'confirm', message: `Are you sure you want to PERMANENTLY delete task "${chalk_1.default.cyan(taskToDelete.title)}"? This action cannot be undone.`, default: false }
        ]);
        if (confirm) {
            const spinnerDelete = ora(chalk_1.default.blue(`Deleting task "${taskToDelete.title}"...`)).start();
            const success = taskService.deleteTask(taskToDelete.id);
            if (success) {
                spinnerDelete.succeed(chalk_1.default.green(`✅ Task "${taskToDelete.title}" deleted successfully.`));
            }
            else {
                spinnerDelete.fail(chalk_1.default.red('❗ Failed to delete task.'));
            }
        }
        else {
            displayService.displayMessage('Task deletion cancelled by user.', 'info');
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        if (mainSpinner && mainSpinner.isSpinning) {
            mainSpinner.fail(chalk_1.default.red(`❗ Error during task deletion: ${message}`));
        }
        else {
            displayService.displayMessage(`❗ Error during task deletion: ${message}`, 'error');
        }
    }
};
exports.deleteTaskCommand = deleteTaskCommand;
