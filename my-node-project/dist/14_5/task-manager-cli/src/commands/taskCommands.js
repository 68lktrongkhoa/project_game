"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskCommand = exports.updateTaskCommand = exports.viewTaskCommand = exports.listTasksCommand = exports.addTaskCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const taskService_1 = require("../services/taskService");
const projectService_1 = require("../services/projectService");
const displayService_1 = require("../services/displayService");
const types_1 = require("../types");
const date_fns_1 = require("date-fns");
const parseDeadlineInput = (input) => {
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
    parsedDate = new Date(input);
    if ((0, date_fns_1.isValid)(parsedDate)) {
        return parsedDate.toISOString();
    }
    return 'invalid_date';
};
const addTaskCommand = async (projectIdPrefix) => {
    const projects = (0, projectService_1.getAllProjects)();
    if (projects.length === 0) {
        console.log(chalk_1.default.red("No projects exist. Please create a project first using 'project create'."));
        return;
    }
    let selectedProject;
    if (projectIdPrefix) {
        selectedProject = (0, projectService_1.getProjectById)(projectIdPrefix);
        if (!selectedProject) {
            console.log(chalk_1.default.red(`Project with ID or prefix "${projectIdPrefix}" not found. Cannot add task.`));
            return;
        }
        console.log(chalk_1.default.blue(`Adding task to project: ${selectedProject.name} (${selectedProject.id.substring(0, 8)})`));
    }
    else {
        const projectChoices = projects.map(p => ({ name: `${p.name} (${p.id.substring(0, 8)})`, value: p.id }));
        const { projectIdFull } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'projectIdFull',
                message: 'Select project for the new task:',
                choices: projectChoices,
            },
        ]);
        selectedProject = projects.find(p => p.id === projectIdFull);
    }
    if (!selectedProject) {
        console.log(chalk_1.default.red("Could not determine the project. Task creation cancelled."));
        return;
    }
    const answers = await inquirer_1.default.prompt([
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
        { type: 'list', name: 'type', message: 'Task type:', choices: Object.values(types_1.TaskType), default: types_1.TaskType.Task },
        { type: 'list', name: 'priority', message: 'Task priority:', choices: Object.values(types_1.TaskPriority), default: types_1.TaskPriority.Medium },
        { type: 'input', name: 'assignee', message: 'Assignee (optional):' },
        {
            type: 'input',
            name: 'deadline',
            message: 'Deadline (YYYY-MM-DD or MM/DD/YYYY, optional, type "none" to skip):',
            filter: (input) => input.trim().toLowerCase(),
            validate: (input) => {
                if (input === 'none' || input === '')
                    return true;
                const parsed = parseDeadlineInput(input);
                if (parsed === 'invalid_date') {
                    return 'Invalid date format. Use YYYY-MM-DD, MM/DD/YYYY, or type "none".';
                }
                return true;
            }
        },
    ]);
    const deadlineISO = parseDeadlineInput(answers.deadline);
    const taskInput = {
        projectId: selectedProject.id,
        title: answers.title,
        description: answers.description,
        type: answers.type,
        priority: answers.priority,
        assignee: answers.assignee,
        deadline: deadlineISO === 'invalid_date' ? undefined : deadlineISO,
    };
    const task = (0, taskService_1.createTask)(taskInput);
    if (task) {
        console.log(chalk_1.default.green(`Task "${task.title}" created with ID ${chalk_1.default.yellow(task.id.substring(0, 8))} in project "${selectedProject.name}".`));
    }
    else {
        console.log(chalk_1.default.red('Failed to create task. This might indicate an issue with project resolution.'));
    }
};
exports.addTaskCommand = addTaskCommand;
const listTasksCommand = async (projectIdPrefix) => {
    let tasksToDisplay;
    let currentProject;
    const allProjects = (0, projectService_1.getAllProjects)();
    if (projectIdPrefix) {
        currentProject = (0, projectService_1.getProjectById)(projectIdPrefix);
        if (!currentProject) {
            console.log(chalk_1.default.red(`Project with ID or prefix "${projectIdPrefix}" not found.`));
            return;
        }
        tasksToDisplay = (0, taskService_1.getAllTasks)(currentProject.id);
        console.log(chalk_1.default.blue(`\n--- Tasks for Project: ${chalk_1.default.cyan(currentProject.name)} ---`));
    }
    else {
        tasksToDisplay = (0, taskService_1.getAllTasks)();
        // console.log(chalk.blue("\n--- All Tasks ---")); 
    }
    (0, displayService_1.displayTasks)(tasksToDisplay, !projectIdPrefix, allProjects);
};
exports.listTasksCommand = listTasksCommand;
const viewTaskCommand = async (taskIdPrefix) => {
    let taskToViewId = taskIdPrefix;
    if (!taskToViewId) {
        const tasks = (0, taskService_1.getAllTasks)();
        if (tasks.length === 0) {
            console.log(chalk_1.default.yellow("No tasks available to view. Create one first!"));
            return;
        }
        const { id } = await inquirer_1.default.prompt([{
                type: 'list',
                name: 'id',
                message: 'Select a task to view:',
                choices: tasks.map(t => ({ name: `${t.title} (${t.id.substring(0, 8)})`, value: t.id }))
            }]);
        taskToViewId = id;
    }
    const task = (0, taskService_1.getTaskById)(taskToViewId);
    if (task) {
        const project = (0, projectService_1.getProjectById)(task.projectId);
        (0, displayService_1.displayTaskDetails)(task, project);
    }
    else {
        console.log(chalk_1.default.red(`Task with ID or prefix "${taskToViewId}" not found.`));
    }
};
exports.viewTaskCommand = viewTaskCommand;
const updateTaskCommand = async (taskIdPrefix) => {
    let taskToUpdateId = taskIdPrefix;
    if (!taskToUpdateId) {
        const tasks = (0, taskService_1.getAllTasks)();
        if (tasks.length === 0) {
            console.log(chalk_1.default.yellow("No tasks available to update."));
            return;
        }
        const { id } = await inquirer_1.default.prompt([{
                type: 'list',
                name: 'id',
                message: 'Select a task to update:',
                choices: tasks.map(t => ({ name: `${t.title} (${t.id.substring(0, 8)})`, value: t.id }))
            }]);
        taskToUpdateId = id;
    }
    const task = (0, taskService_1.getTaskById)(taskToUpdateId);
    if (!task) {
        console.log(chalk_1.default.red(`Task with ID or prefix "${taskToUpdateId}" not found.`));
        return;
    }
    const project = (0, projectService_1.getProjectById)(task.projectId);
    console.log(chalk_1.default.blue(`\nUpdating task: ${task.title} (${task.id.substring(0, 8)})`));
    if (project)
        console.log(chalk_1.default.blue(`In project: ${project.name}`));
    const answers = await inquirer_1.default.prompt([
        { type: 'input', name: 'title', message: 'New task title (leave blank to keep current):', default: task.title },
        { type: 'input', name: 'description', message: 'New task description (leave blank to keep current, "clear" to remove):', default: task.description || '' },
        { type: 'list', name: 'status', message: 'New task status:', choices: Object.values(types_1.TaskStatus), default: task.status },
        { type: 'list', name: 'priority', message: 'New task priority:', choices: Object.values(types_1.TaskPriority), default: task.priority },
        { type: 'list', name: 'type', message: 'New task type:', choices: Object.values(types_1.TaskType), default: task.type },
        { type: 'input', name: 'assignee', message: 'New assignee (leave blank to keep current, "clear" to remove):', default: task.assignee || '' },
        {
            type: 'input',
            name: 'deadline',
            message: 'New deadline (YYYY-MM-DD, "clear" to remove, blank to keep current):',
            default: task.deadline ? (0, date_fns_1.format)((0, date_fns_1.parseISO)(task.deadline), 'yyyy-MM-dd') : '',
            validate: (input) => {
                if (input.toLowerCase() === 'clear' || input === '')
                    return true;
                const parsed = parseDeadlineInput(input);
                if (parsed === 'invalid_date') {
                    return 'Invalid date format. Use YYYY-MM-DD, MM/DD/YYYY, "clear", or leave blank.';
                }
                return true;
            }
        },
    ]);
    const updates = {};
    if (answers.title && answers.title !== task.title)
        updates.title = answers.title;
    if (answers.description.toLowerCase() === 'clear') {
        updates.description = undefined;
    }
    else if (answers.description !== (task.description || '')) {
        updates.description = answers.description || undefined;
    }
    if (answers.status !== task.status)
        updates.status = answers.status;
    if (answers.priority !== task.priority)
        updates.priority = answers.priority;
    if (answers.type !== task.type)
        updates.type = answers.type;
    if (answers.assignee.toLowerCase() === 'clear') {
        updates.assignee = undefined;
    }
    else if (answers.assignee !== (task.assignee || '')) {
        updates.assignee = answers.assignee || undefined;
    }
    if (answers.deadline.toLowerCase() === 'clear') {
        updates.deadline = undefined;
    }
    else if (answers.deadline) {
        const newDeadlineISO = parseDeadlineInput(answers.deadline);
        if (newDeadlineISO && newDeadlineISO !== 'invalid_date' && newDeadlineISO !== task.deadline) {
            updates.deadline = newDeadlineISO;
        }
    }
    else if (answers.deadline === '' && task.deadline) {
        // User left blank, but there was a deadline, so keep current
        // No action needed for updates.deadline
    }
    if (Object.keys(updates).length > 0) {
        const updated = (0, taskService_1.updateTask)(task.id, updates);
        if (updated) {
            console.log(chalk_1.default.green(`Task "${updated.title}" updated.`));
            const updatedProject = (0, projectService_1.getProjectById)(updated.projectId);
            (0, displayService_1.displayTaskDetails)(updated, updatedProject);
        }
        else {
            console.log(chalk_1.default.red('Failed to update task.'));
        }
    }
    else {
        console.log(chalk_1.default.yellow('No changes made to the task.'));
    }
};
exports.updateTaskCommand = updateTaskCommand;
const deleteTaskCommand = async (taskIdPrefix) => {
    let taskToDeleteId = taskIdPrefix;
    if (!taskToDeleteId) {
        const tasks = (0, taskService_1.getAllTasks)();
        if (tasks.length === 0) {
            console.log(chalk_1.default.yellow("No tasks available to delete."));
            return;
        }
        const { id } = await inquirer_1.default.prompt([{
                type: 'list',
                name: 'id',
                message: 'Select a task to delete:',
                choices: tasks.map(t => ({ name: `${t.title} (${t.id.substring(0, 8)})`, value: t.id }))
            }]);
        taskToDeleteId = id;
    }
    const task = (0, taskService_1.getTaskById)(taskToDeleteId);
    if (!task) {
        console.log(chalk_1.default.red(`Task with ID or prefix "${taskToDeleteId}" not found.`));
        return;
    }
    const { confirm } = await inquirer_1.default.prompt([
        { type: 'confirm', name: 'confirm', message: `Are you sure you want to delete task "${chalk_1.default.yellowBright(task.title)}"? This cannot be undone.`, default: false }
    ]);
    if (confirm) {
        if ((0, taskService_1.deleteTask)(task.id)) {
            console.log(chalk_1.default.green(`Task "${task.title}" deleted.`));
        }
        else {
            console.log(chalk_1.default.red('Failed to delete task.'));
        }
    }
    else {
        console.log(chalk_1.default.yellow('Task deletion cancelled.'));
    }
};
exports.deleteTaskCommand = deleteTaskCommand;
