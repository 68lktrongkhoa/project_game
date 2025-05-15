import { ProjectStatus } from "../enums/project.enums";

export interface Project {
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    createdAt: string; 
    updatedAt: string; 
}