import { v4 as uuidv4 } from 'uuid';
import { TaskStatus, TaskPriority, TaskType } from '../types/enums/task.enums';

export class Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    type: TaskType;
    projectId: string;
    assignee?: string;
    deadline?: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        projectId: string,
        title: string,
        description: string = '',
        priority: TaskPriority = TaskPriority.Medium,
        type: TaskType = TaskType.Task,
        id?: string,
        status?: TaskStatus,
        assignee?: string,
        deadline?: Date,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id || uuidv4();
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.status = status || TaskStatus.Open;
        this.priority = priority;
        this.type = type;
        this.assignee = assignee;
        this.deadline = deadline;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    static fromPlainObject(obj: Record<string, any>): Task {
        return new Task(
            obj.projectId,
            obj.title,
            obj.description,
            obj.priority as TaskPriority,
            obj.type as TaskType,
            obj.id,
            obj.status as TaskStatus,
            obj.assignee,
            obj.deadline ? new Date(obj.deadline) : undefined,
            obj.createdAt ? new Date(obj.createdAt) : undefined,
            obj.updatedAt ? new Date(obj.updatedAt) : undefined
        );
    }
}