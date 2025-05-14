import { getAllProjects } from '../services/projectService';
import { getAllTasks } from '../services/taskService';
import { displayDashboard } from '../services/displayService';
import { TaskStatus } from '../types';
import chalk from 'chalk';

let ora: any;
async function loadOra() { if (!ora) ora = (await import('ora')).default; }

export const showDashboardCommand = async () => {
    await loadOra();
    const spinner = ora(chalk.blue('Loading dashboard data...')).start();
    try {
        const projects = getAllProjects();
        const tasks = getAllTasks();

        const projectStats = {
            totalProjects: projects.length,
            open: tasks.filter(t => t.status === TaskStatus.Open).length,
            inProgress: tasks.filter(t => t.status === TaskStatus.InProgress).length,
            done: tasks.filter(t => t.status === TaskStatus.Resolved || t.status === TaskStatus.Closed).length,
        };

        const recentTasks = [...tasks]
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5);
        displayDashboard(projectStats, recentTasks, projects);
        spinner.succeed(chalk.green('Dashboard data loaded!'));
    } catch (error) {
        spinner.fail(chalk.red('❗ Failed to load dashboard data.'));
        console.error(error);
    }

};