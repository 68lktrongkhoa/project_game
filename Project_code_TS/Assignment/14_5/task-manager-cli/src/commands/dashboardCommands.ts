import chalk from 'chalk';
import { ProjectService } from '../services/projectService';
import { TaskService } from '../services/taskService';
import { DisplayService } from '../services/displayService';

import { TaskStatus } from '../types/enums/task.enums';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

let oraInstance: any;
async function loadOra() {
    if (!oraInstance) {
        const oraModule = await import('ora');
        oraInstance = oraModule.default;
    }
    return oraInstance;
}

interface DashboardCommandDependencies {
    projectService: ProjectService;
    taskService: TaskService;
    displayService: DisplayService;
}

export const showDashboardCommand = async (dependencies: DashboardCommandDependencies) => {
    const { projectService, taskService, displayService } = dependencies;
    const ora = await loadOra();
    const spinner = ora(chalk.blue('📊 Loading dashboard data...')).start();

    try {
        const projects: Project[] = projectService.getAllProjects();
        const tasks: Task[] = taskService.getAllTasks();

        const projectStats = {
            totalProjects: projects.length,
            open: tasks.filter(t => t.status === TaskStatus.Open).length,
            inProgress: tasks.filter(t => t.status === TaskStatus.InProgress).length,
            done: tasks.filter(t => t.status === TaskStatus.Resolved || t.status === TaskStatus.Closed).length,
        };

        const recentTasks = [...tasks]
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5);

        spinner.succeed(chalk.green('📊 Dashboard data loaded successfully!'));
        displayService.displayDashboard(projectStats, recentTasks, projects);

    } catch (error: unknown) {
        if (spinner && spinner.isSpinning) {
            spinner.fail(chalk.red('❗ Failed to load dashboard data.'));
        } else {
            console.error(chalk.red('❗ Failed to load dashboard data.'));
        }
        if (error instanceof Error) {
            console.error(chalk.red(error.message));
        } else {
            console.error(chalk.red('An unknown error occurred while loading dashboard.'));
        }
    }
};