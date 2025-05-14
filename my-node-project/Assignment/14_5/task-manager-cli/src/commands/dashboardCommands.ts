import chalk from 'chalk';
import { getAllProjects } from '../services/projectService';
import { getAllTasks } from '../services/taskService';
import { displayDashboard } from '../services/displayService';
import { TaskStatus, Project, Task }
from '../types'; 
let ora: any;
async function loadOra() { if (!ora) ora = (await import('ora')).default; }

export const showDashboardCommand = async () => {
    await loadOra();
    const spinner = ora(chalk.blue('📊 Loading dashboard data...')).start();

    try {
        const projects: Project[] = getAllProjects();
        const tasks: Task[] = getAllTasks();

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
        displayDashboard(projectStats, recentTasks, projects);

    } catch (error: any) { 
        if (spinner && spinner.isSpinning) { 
            spinner.fail(chalk.red('❗ Failed to load dashboard data.'));
        } else {
            console.error(chalk.red('❗ Failed to load dashboard data.'));
        }
        console.error(chalk.red(error.message || 'An unknown error occurred while loading dashboard.'));
    }
};