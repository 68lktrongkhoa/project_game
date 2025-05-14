// src/types.ts
export enum ProjectStatus {
    Active = "Active",
    Completed = "Completed",
    Archived = "Archived",
  }
  
  export enum TaskStatus {
    Open = "Open",
    InProgress = "In Progress",
    Resolved = "Resolved", 
    Closed = "Closed",
  }
  
  export enum TaskPriority {
    Low = "Low",
    Medium = "Medium",
    High = "High",
  }
  
  export enum TaskType {
    Task = "Task",
    Bug = "Bug",
    Request = "Request",
    Enhancement = "Enhancement",
  }
  
  export interface Project {
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    createdAt: string; 
    updatedAt: string; 
  }
  
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
  
  export interface AppData {
    projects: Project[];
    tasks: Task[];
  }