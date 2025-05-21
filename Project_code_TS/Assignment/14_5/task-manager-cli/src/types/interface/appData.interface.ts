import { Task } from "../interface/task.interface";
import { Project } from "./project.interface";

export interface AppData {
    projects: Project[];
    tasks: Task[];
}