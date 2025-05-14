import chalk from 'chalk'; 
import { Project, Task, TaskStatus, ProjectStatus, TaskPriority } from '../types';
import { format, parseISO } from 'date-fns';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'yyyy-MM-dd HH:mm');
  } catch (e) {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      console.warn(`Could not parse date: ${dateString}`);
      return dateString;
    }
  }
};

export const displayProjects = (projects: Project[]): void => {
  if (projects.length === 0) {
    console.log(chalk.yellow("No projects found."));
    return;
  }
  console.log(chalk.bold.blue("\n--- Projects ---"));
  projects.forEach(p => {
    console.log(
      `${chalk.green(p.id.substring(0, 8))} - ${chalk.cyan(p.name)} (${chalk.magenta(p.status)}) - Created: ${formatDate(p.createdAt)}`
    );
    if (p.description) console.log(`  ${chalk.gray(p.description)}`);
  });
  console.log("");
};

export const displayProjectDetails = (project: Project, tasks: Task[]): void => {
  console.log(chalk.bold.blue(`\n--- Project: ${project.name} ---`));
  console.log(`${chalk.green('ID:')} ${project.id}`);
  console.log(`${chalk.green('Status:')} ${chalk.magenta(project.status)}`);
  console.log(`${chalk.green('Created:')} ${formatDate(project.createdAt)}`);
  console.log(`${chalk.green('Updated:')} ${formatDate(project.updatedAt)}`);
  if (project.description) console.log(`${chalk.green('Description:')} ${project.description}`);

  console.log(chalk.bold.magentaBright("\n  Tasks in this project:"));
  if (tasks.length === 0) {
    console.log(chalk.yellow("  No tasks in this project."));
  } else {
    displayTasks(tasks, false); // Don't show project name again
  }
  console.log("");
};

export const displayTasks = (tasks: Task[], showProjectName: boolean = true, projects: Project[] = []): void => {
  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks found."));
    return;
  }
  if (showProjectName && tasks.length > 0) console.log(chalk.bold.magentaBright("\n--- Tasks ---"));
  
  tasks.forEach(t => {
    let projectInfo = '';
    if (showProjectName) {
        const project = projects.find(p => p.id === t.projectId);
        projectInfo = project ? ` (Project: ${chalk.cyan(project.name)})` : ` (Project ID: ${chalk.gray(t.projectId.substring(0,8))})`;
    }

    let statusColor = chalk.white;
    switch (t.status) {
        case TaskStatus.Open: statusColor = chalk.yellow; break;
        case TaskStatus.InProgress: statusColor = chalk.blue; break;
        case TaskStatus.Resolved: statusColor = chalk.green; break;
        case TaskStatus.Closed: statusColor = chalk.gray; break;
    }

    let priorityColor = chalk.white;
     switch (t.priority) {
        case TaskPriority.Low: priorityColor = chalk.greenBright; break;
        case TaskPriority.Medium: priorityColor = chalk.yellowBright; break;
        case TaskPriority.High: priorityColor = chalk.redBright; break;
    }

    console.log(
      `${chalk.green(t.id.substring(0,8))} - ${chalk.whiteBright(t.title)} [${chalk.blueBright(t.type)}] - ${statusColor.bold(t.status)} - Priority: ${priorityColor(t.priority)}${projectInfo}`
    );
    if (t.description) console.log(`  ${chalk.gray(t.description)}`);
    if (t.assignee) console.log(`  Assigned to: ${chalk.magenta(t.assignee)}`);
    if (t.deadline) console.log(`  Deadline: ${chalk.red(formatDate(t.deadline))}`);
  });
  console.log("");
};

export const displayTaskDetails = (task: Task, project?: Project): void => {
    console.log(chalk.bold.magentaBright(`\n--- Task: ${task.title} ---`));
    console.log(`${chalk.green('ID:')} ${task.id}`);
    if (project) console.log(`${chalk.green('Project:')} ${chalk.cyan(project.name)} (${project.id.substring(0,8)})`);
    else console.log(`${chalk.green('Project ID:')} ${task.projectId}`);
    
    let statusColor = chalk.white;
    switch (task.status) {
        case TaskStatus.Open: statusColor = chalk.yellow; break;
        case TaskStatus.InProgress: statusColor = chalk.blue; break;
        case TaskStatus.Resolved: statusColor = chalk.green; break;
        case TaskStatus.Closed: statusColor = chalk.gray; break;
    }
    console.log(`${chalk.green('Status:')} ${statusColor.bold(task.status)}`);

    console.log(`${chalk.green('Type:')} ${chalk.blueBright(task.type)}`);

    let priorityColor = chalk.white;
     switch (task.priority) {
        case TaskPriority.Low: priorityColor = chalk.greenBright; break;
        case TaskPriority.Medium: priorityColor = chalk.yellowBright; break;
        case TaskPriority.High: priorityColor = chalk.redBright; break;
    }
    console.log(`${chalk.green('Priority:')} ${priorityColor(task.priority)}`);

    if (task.description) console.log(`${chalk.green('Description:')} ${task.description}`);
    if (task.assignee) console.log(`${chalk.green('Assignee:')} ${chalk.magenta(task.assignee)}`);
    if (task.deadline) console.log(`${chalk.green('Deadline:')} ${chalk.red(formatDate(task.deadline))}`);
    console.log(`${chalk.green('Created:')} ${formatDate(task.createdAt)}`);
    console.log(`${chalk.green('Updated:')} ${formatDate(task.updatedAt)}`);
    console.log("");
};

export const displayDashboard = (
    projectStats: { open: number; inProgress: number; done: number; totalProjects: number },
    recentTasks: Task[],
    allProjects: Project[]
) => {
    console.log(chalk.bold.cyanBright("\n--- DASHBOARD ---"));

    console.log(chalk.bold.blue("\nProject Statistics:"));
    console.log(`  Total Projects: ${chalk.yellow(projectStats.totalProjects)}`);
    
    console.log(chalk.bold.magentaBright("\nTask Statistics (across all projects):"));
    console.log(`  Open: ${chalk.yellow(projectStats.open)}`);
    console.log(`  In Progress: ${chalk.blue(projectStats.inProgress)}`);
    console.log(`  Done (Resolved/Closed): ${chalk.green(projectStats.done)}`);


    console.log(chalk.bold.blue("\nActive Projects (first 5 or less):"));
    const activeProjects = allProjects.filter(p => p.status === ProjectStatus.Active).slice(0, 5);
    if (activeProjects.length > 0) {
        activeProjects.forEach(p => console.log(`  - ${chalk.cyan(p.name)} (${p.id.substring(0,8)})`));
    } else {
        console.log(chalk.gray("  No active projects."));
    }


    console.log(chalk.bold.magentaBright("\nRecent Tasks (last 5 created/updated):"));
    if (recentTasks.length > 0) {
        displayTasks(recentTasks, true, allProjects); // Truyền allProjects vào đây
    } else {
        console.log(chalk.gray("  No recent tasks."));
    }

    console.log(chalk.bold.gray("\nShortcuts:"));
    console.log(chalk.gray("  Use 'npm start -- help' or 'node dist/index.js help' to see all commands."));
    console.log(chalk.gray("  Examples:"));
    console.log(chalk.gray("    npm start -- project create"));
    console.log(chalk.gray("    npm start -- task add"));
    console.log("");
};