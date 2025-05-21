import { TaskPriority, TaskType } from '../types/enums/task.enums';
import { Task } from '../models/Task';
import { StorageService, AppData } from './storageService';
import { ProjectService } from './projectService';
import { Project } from '../models/Project';
import { LogMethodCalls } from '../decorator/logging.decorator';

export interface CreateTaskInput {
    projectId: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    deadline?: string | Date; 
    assignee?: string;
    type?: TaskType; 
}

export class TaskService {
    private storageService: StorageService;
    private projectService: ProjectService;
    constructor(storageService: StorageService, projectService: ProjectService) {
        this.storageService = storageService;
        this.projectService = projectService;
    }

    @LogMethodCalls
    public createTask(input: CreateTaskInput): Task | null {
        const data: AppData = this.storageService.loadData();
        const project: Project | undefined = this.projectService.getProjectById(input.projectId);

        if (!project) {
            return null;
        }

        const newTask = new Task(
            project.id, 
            input.title,
            input.description,
            input.priority, 
            input.type, 
            undefined, 
            undefined,
            input.assignee,
            input.deadline ? new Date(input.deadline) : undefined 
        );

        data.tasks.push(newTask);
        this.storageService.saveData(data);
        return newTask;
    }

    @LogMethodCalls
    public getAllTasks(projectId?: string): Task[] {
        const data: AppData = this.storageService.loadData();
        if (projectId) {
            const project = this.projectService.getProjectById(projectId);
            return project ? data.tasks.filter(t => t.projectId === project.id) : [];
        }
        return [...data.tasks];
    }

    @LogMethodCalls
    public getTaskById(id: string): Task | undefined {
        if (!id?.trim()) return undefined;
        const data: AppData = this.storageService.loadData();

        let task = data.tasks.find(t => t.id === id);
        if (!task) {
            const matchingTasks = data.tasks.filter(t => t.id.startsWith(id));
            if (matchingTasks.length === 1) {
                task = matchingTasks[0];
            } else if (matchingTasks.length > 1) {
                console.warn(`Multiple tasks found with prefix "${id}". Please use a more specific ID or full ID.`);
                return undefined;
            }
        }
        return task;
    }

    @LogMethodCalls
    public updateTask(
        id: string,
        updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'status' | 'type' | 'assignee' | 'deadline'>>
    ): Task | undefined {
        const data: AppData = this.storageService.loadData();
        const taskToUpdate = this.getTaskById(id);

        if (!taskToUpdate) {
            return undefined;
        }

        const taskIndex = data.tasks.findIndex(t => t.id === taskToUpdate.id);
        if (taskIndex === -1) return undefined;

        const taskInstance = data.tasks[taskIndex];

        if (updates.title !== undefined) taskInstance.title = updates.title;
        if (updates.description !== undefined) taskInstance.description = updates.description;
        if (updates.priority !== undefined) taskInstance.priority = updates.priority;
        if (updates.status !== undefined) taskInstance.status = updates.status;
        if (updates.type !== undefined) taskInstance.type = updates.type;
        if (updates.assignee !== undefined) taskInstance.assignee = updates.assignee === '' ? undefined : updates.assignee;
        if (updates.deadline !== undefined) {
            taskInstance.deadline = updates.deadline ? new Date(updates.deadline) : undefined;
        }
        taskInstance.updatedAt = new Date();

        this.storageService.saveData(data);
        return taskInstance;
    }

    public deleteTask(id: string): boolean {
        const data: AppData = this.storageService.loadData();
        const taskToDelete = this.getTaskById(id);

        if (!taskToDelete) {
            return false;
        }

        const initialLength = data.tasks.length;
        data.tasks = data.tasks.filter(t => t.id !== taskToDelete.id);

        if (data.tasks.length < initialLength) {
            this.storageService.saveData(data);
            return true;
        }
        return false;
    }
}