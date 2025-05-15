import { TaskPriority, TaskStatus, TaskType } from "../enums/task.enums";

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    deadline?: string; 
    assignee?: string;
    status: TaskStatus;
    type: TaskType;
    createdAt: string;
    updatedAt: string;
  }

export { TaskStatus };