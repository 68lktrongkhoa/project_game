// src/models/Project.ts
import { v4 as uuidv4 } from 'uuid';
import { ProjectStatus } from '../types/enums/project.enums';
import { Task } from './Task';

export class Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    createdAt: Date;
    updatedAt: Date;
    tasks: Task[];

    constructor(
        name: string,
        description: string = '',
        id?: string,
        status?: ProjectStatus,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id || uuidv4();
        this.name = name;
        this.description = description;
        this.status = status || ProjectStatus.Active;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.tasks = [];
    }

    updateDetails(name: string, description: string): void {
        this.name = name;
        this.description = description;
        this.updatedAt = new Date();
    }

    updateStatus(status: ProjectStatus): void {
        this.status = status;
        this.updatedAt = new Date();
    }
    static fromPlainObject(obj: Record<string, any>): Project {
        const project = new Project(
            obj.name,
            obj.description,
            obj.id,
            obj.status as ProjectStatus,
            obj.createdAt ? new Date(obj.createdAt) : undefined,
            obj.updatedAt ? new Date(obj.updatedAt) : undefined
        );
        return project;
    }
}