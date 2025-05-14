import { getAllProjects } from '../services/projectService';
import { getAllTasks } from '../services/taskService'; 
import { displayDashboard } from '../services/displayService'; 
import { TaskStatus } from '../types';                

export const showDashboardCommand = () => {
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
};