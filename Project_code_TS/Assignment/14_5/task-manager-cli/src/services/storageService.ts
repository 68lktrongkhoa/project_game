import fs from 'fs';
import path from 'path';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { LogMethodCalls } from '../decorator/logging.decorator';

export interface AppData {
    projects: Project[];
    tasks: Task[];
}

export class StorageService {
    private readonly filePath: string;
    private readonly defaultData: AppData = { projects: [], tasks: [] };

    constructor(fileName: string = 'task-manager-data.json') {
        this.filePath = path.join(process.cwd(), fileName);
        this.ensureDataFileExists();
    }

    @LogMethodCalls
    private ensureDataFileExists(): void {
        try {
            if (!fs.existsSync(this.filePath)) {
                fs.writeFileSync(this.filePath, JSON.stringify(this.defaultData, null, 2), 'utf-8');
                console.log(`Data file created at: ${this.filePath}`);
            }
        } catch (error) {
            console.error('Error ensuring data file exists:', error);
        }
    }

    @LogMethodCalls
    public loadData(): AppData {
        try {
            const fileContent = fs.readFileSync(this.filePath, 'utf-8');
            const plainData = JSON.parse(fileContent);
            const projects = (plainData.projects || []).map((pObj: any) => Project.fromPlainObject(pObj));
            const tasks = (plainData.tasks || []).map((tObj: any) => Task.fromPlainObject(tObj));

            return { projects, tasks };

        } catch (error: any) {
            console.error(`Error loading data from ${this.filePath}:`, error.message);
            return { ...this.defaultData };
        }
    }

    @LogMethodCalls
    public saveData(data: AppData): void {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error: any) {
            console.error(`Error saving data to ${this.filePath}:`, error.message);
        }
    }
}