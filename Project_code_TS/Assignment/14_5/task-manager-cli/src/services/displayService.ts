import chalk from 'chalk';
import { format, parseISO } from 'date-fns';
import Table from 'cli-table3';
import { ProjectStatus } from '../types/enums/project.enums';
import { TaskPriority, TaskStatus } from '../types/enums/task.enums';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { LogMethodCalls } from '../decorator/logging.decorator';


export class DisplayService {
    @LogMethodCalls
    private formatDate(dateString?: string | Date): string {
        if (!dateString) return chalk.gray('N/A');
        try {
            if (dateString instanceof Date) {
                return format(dateString, 'yyyy-MM-dd HH:mm');
            }
            return format(parseISO(dateString), 'yyyy-MM-dd HH:mm');
        } catch (e) {
            try {
                return format(new Date(dateString as string), 'yyyy-MM-dd HH:mm');
            } catch (error) {
                return chalk.gray(String(dateString));
            }
        }
    }
    @LogMethodCalls
    private formatStatus(status: TaskStatus | ProjectStatus): string {
        switch (status) {
            case TaskStatus.Open: return chalk.yellow.bold(status);
            case TaskStatus.InProgress: return chalk.blue.bold(status);
            case TaskStatus.Resolved: return chalk.green.bold(status);
            case TaskStatus.Closed: return chalk.gray.bold(status);
            case ProjectStatus.Active: return chalk.greenBright.bold(status);
            case ProjectStatus.Completed: return chalk.blueBright.bold(status);
            case ProjectStatus.Archived: return chalk.gray.bold(status);
            default: return chalk.white(status);
        }
    }

    @LogMethodCalls
    private formatPriority(priority: TaskPriority): string {
        switch (priority) {
            case TaskPriority.Low: return chalk.green(priority);
            case TaskPriority.Medium: return chalk.yellow(priority);
            case TaskPriority.High: return chalk.red(priority);
            default: return chalk.white(priority);
        }
    }

    @LogMethodCalls
    public displayProjects(projects: Project[]): void {
        if (projects.length === 0) {
            console.log(chalk.yellow("No projects found."));
            return;
        }

        const table = new Table({
            head: [
                chalk.cyan('ID (Prefix)'),
                chalk.cyan('Name'),
                chalk.cyan('Status'),
                chalk.cyan('Description'),
                chalk.cyan('Created At')
            ],
            colWidths: [10, 25, 12, 35, 18],
            wordWrap: true,
            style: { head: ['blue'], border: ['grey'] }
        });

        projects.forEach(p => {
            table.push([
                p.id.substring(0, 8),
                chalk.whiteBright(p.name),
                this.formatStatus(p.status),
                p.description || chalk.gray('N/A'),
                this.formatDate(p.createdAt)
            ]);
        });

        console.log(chalk.bold.blue("\n--- Projects ---"));
        console.log(table.toString());
        console.log("");
    }

    @LogMethodCalls
    public displayProjectDetails(project: Project, tasks: Task[]): void {
        console.log(chalk.bold.blue(`\n--- Project Details: ${chalk.cyanBright(project.name)} ---`));

        const detailsTable = new Table({ style: { compact: true, 'padding-left': 1 } });
        detailsTable.push(
            { [chalk.green('ID')]: project.id },
            { [chalk.green('Name')]: chalk.whiteBright(project.name) },
            { [chalk.green('Status')]: this.formatStatus(project.status) },
            { [chalk.green('Description')]: project.description || chalk.gray('N/A') },
            { [chalk.green('Created At')]: this.formatDate(project.createdAt) },
            { [chalk.green('Updated At')]: this.formatDate(project.updatedAt) }
        );
        console.log(detailsTable.toString());

        console.log(chalk.bold.magentaBright("\n  Tasks in this project:"));
        if (tasks.length === 0) {
            console.log(chalk.yellow("  No tasks in this project."));
        } else {
            this.displayTasks(tasks, false, [project]);
        }
        console.log("");
    }

    @LogMethodCalls
    public displayTasks(tasks: Task[], showProjectName: boolean = true, allProjects: Project[] = []): void {
        if (tasks.length === 0) {
            console.log(chalk.yellow("ℹ️ No tasks found for the current filter."));
            return;
        }

        const headColumns = [
            chalk.magenta('ID (Prefix)'),
            chalk.magenta('Title'),
            chalk.magenta('Status'),
            chalk.magenta('Priority'),
            chalk.magenta('Type'),
            chalk.magenta('Deadline'),
        ];
        const colWidthsValues = [10, 30, 14, 10, 15, 18];

        if (showProjectName) {
            headColumns.splice(2, 0, chalk.magenta('Project'));
            colWidthsValues.splice(2, 0, 20);
        }

        const table = new Table({
            head: headColumns,
            colWidths: colWidthsValues,
            wordWrap: true,
            style: { head: ['magenta'], border: ['grey'] }
        });

        tasks.forEach(t => {
            const row = [
                t.id.substring(0, 8),
                chalk.whiteBright(t.title),
                this.formatStatus(t.status),
                this.formatPriority(t.priority),
                chalk.blueBright(t.type),
                this.formatDate(t.deadline),
            ];

            if (showProjectName) {
                const project = allProjects.find(p => p.id === t.projectId);
                row.splice(2, 0, project ? chalk.cyan(project.name) : chalk.gray(t.projectId.substring(0, 8)));
            }

            table.push(row);
        });


        if (showProjectName && tasks.length > 0) {
            console.log(chalk.bold.magentaBright("\n--- All Tasks ---"));
        } else if (tasks.length > 0) {
            console.log(chalk.bold.magentaBright("\n--- Tasks ---"));
        }
        console.log(table.toString());
        console.log("");
    }

    @LogMethodCalls
    public displayTaskDetails(task: Task, project?: Project): void {
        console.log(chalk.bold.magentaBright(`\n--- Task Details: ${chalk.whiteBright(task.title)} ---`));

        const detailsTable = new Table({ style: { compact: true, 'padding-left': 1 } });
        detailsTable.push(
            { [chalk.green('ID')]: task.id },
            { [chalk.green('Title')]: chalk.whiteBright(task.title) }
        );
        if (project) {
            detailsTable.push({ [chalk.green('Project')]: `${chalk.cyan(project.name)} (${project.id.substring(0, 8)})` });
        } else {
            detailsTable.push({ [chalk.green('Project ID')]: task.projectId });
        }
        detailsTable.push(
            { [chalk.green('Status')]: this.formatStatus(task.status) },
            { [chalk.green('Priority')]: this.formatPriority(task.priority) },
            { [chalk.green('Type')]: chalk.blueBright(task.type) },
            { [chalk.green('Description')]: task.description || chalk.gray('N/A') },
            { [chalk.green('Assignee')]: task.assignee || chalk.gray('N/A') },
            { [chalk.green('Deadline')]: this.formatDate(task.deadline) },
            { [chalk.green('Created At')]: this.formatDate(task.createdAt) },
            { [chalk.green('Updated At')]: this.formatDate(task.updatedAt) }
        );
        console.log(detailsTable.toString());
        console.log("");
    }

    @LogMethodCalls
    public displayDashboard(
        projectStats: { open: number; inProgress: number; done: number; totalProjects: number },
        recentTasks: Task[],
        allProjects: Project[]
    ): void {
        console.log(chalk.bold.cyanBright("\n✨✨✨ TASK MANAGER DASHBOARD ✨✨✨"));

        const statsTable = new Table({
            head: [chalk.blue('📊 Metric'), chalk.blue('Count')],
            colWidths: [30, 10],
            style: { head: ['blue'], border: ['grey'] }
        });
        statsTable.push(
            ['Total Projects', chalk.yellow(projectStats.totalProjects)],
            ['Tasks - Open', chalk.yellow(projectStats.open)],
            ['Tasks - In Progress', chalk.blue(projectStats.inProgress)],
            ['Tasks - Done (Resolved/Closed)', chalk.green(projectStats.done)]
        );
        console.log(chalk.bold.blue("\n📈 Project & Task Statistics:"));
        console.log(statsTable.toString());

        console.log(chalk.bold.blue("\n🚀 Active Projects (first 5):"));
        const activeProjects = allProjects.filter(p => p.status === ProjectStatus.Active).slice(0, 5);
        if (activeProjects.length > 0) {
            activeProjects.forEach(p => console.log(`  ${chalk.greenBright('🟢')} ${chalk.cyan(p.name)} (${p.id.substring(0, 8)})`));
        } else {
            console.log(chalk.gray("  No active projects."));
        }
        console.log("");

        console.log(chalk.bold.magentaBright("⏳ Recent Tasks (last 5 created/updated):"));
        if (recentTasks.length > 0) {
            this.displayTasks(recentTasks, true, allProjects);
        } else {
            console.log(chalk.gray("  No recent tasks."));
        }

        console.log(chalk.bold.gray("\n💡 Tip: Navigate using the Main Menu options."));
        console.log("");
    }

    @LogMethodCalls
    public displayMessage(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
        switch (type) {
            case 'success':
                console.log(chalk.greenBright(`✅ ${message}`));
                break;
            case 'error':
                console.log(chalk.redBright(`❌ ${message}`));
                break;
            case 'warning':
                console.log(chalk.yellowBright(`⚠️ ${message}`));
                break;
            case 'info':
            default:
                console.log(chalk.blueBright(`ℹ️ ${message}`));
                break;
        }
    }
}