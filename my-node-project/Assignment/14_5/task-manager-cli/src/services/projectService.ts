import { LogMethodCalls } from '../decorator/logging.decorator';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { StorageService, AppData } from './storageService';

export class ProjectService {
    private storageService: StorageService;

    constructor(storageService: StorageService) {
        this.storageService = storageService;
    }

    @LogMethodCalls
    public createProject(name: string, description?: string): Project {
        const data: AppData = this.storageService.loadData();
        const newProject = new Project(name, description || '');
        data.projects.push(newProject);
        this.storageService.saveData(data);
        return newProject;
    }

    @LogMethodCalls
    public getAllProjects(): Project[] {
        const data: AppData = this.storageService.loadData();
        return [...data.projects];
    }

    @LogMethodCalls
    public getProjectById(id: string): Project | undefined {
        if (!id?.trim()) return undefined;
        const data: AppData = this.storageService.loadData();

        let project = data.projects.find(p => p.id === id);
        if (!project) {
            const matchingProjects = data.projects.filter(p => p.id.startsWith(id));
            if (matchingProjects.length === 1) {
                project = matchingProjects[0];
            } else if (matchingProjects.length > 1) {
                console.warn(`Multiple projects found with prefix "${id}". Please use a more specific ID or full ID.`);
                return undefined;
            }
        }
        return project;
    }

    @LogMethodCalls
    public updateProject(
        id: string,
        updates: Partial<Pick<Project, 'name' | 'description' | 'status'>>
    ): Project | undefined {
        const data: AppData = this.storageService.loadData();
        const projectToUpdate = this.getProjectById(id);

        if (!projectToUpdate) {
            return undefined;
        }

        const projectIndex = data.projects.findIndex(p => p.id === projectToUpdate.id);
        if (projectIndex === -1) return undefined;

        const projectInstance = data.projects[projectIndex]; 

        if (updates.name !== undefined) {
            projectInstance.name = updates.name;
        }
        if (updates.description !== undefined) {
            projectInstance.description = updates.description;
        }
        if (updates.status !== undefined) {
            projectInstance.status = updates.status;
        }
        projectInstance.updatedAt = new Date();

        this.storageService.saveData(data);
        return projectInstance;
    }

    @LogMethodCalls
    public deleteProject(id: string): boolean {
        const data: AppData = this.storageService.loadData();
        const projectToDelete = this.getProjectById(id);

        if (!projectToDelete) {
            return false;
        }

        const initialProjectsLength = data.projects.length;
        data.projects = data.projects.filter(p => p.id !== projectToDelete.id);
        const initialTasksLength = data.tasks.length;
        data.tasks = data.tasks.filter(t => t.projectId !== projectToDelete.id);

        if (data.projects.length < initialProjectsLength || data.tasks.length < initialTasksLength) {
            this.storageService.saveData(data);
            return true;
        }
        return false;
    }
    public getTasksForProject(projectId: string): Task[] {
        const project = this.getProjectById(projectId);
        if (!project) {
            console.warn(`Project with ID "${projectId}" not found when trying to get its tasks.`);
            return [];
        }
        const data = this.storageService.loadData();
        return data.tasks.filter(task => task.projectId === project.id);
    }
}