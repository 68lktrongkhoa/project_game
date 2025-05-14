import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus, TaskPriority, TaskType, AppData } from '../types';
import { loadData, saveData } from './storageService';
import { getProjectById } from './projectService';

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;
  assignee?: string;
  type: TaskType;
}

export const createTask = (input: CreateTaskInput): Task | null => {
  const data = loadData();
  const project = getProjectById(input.projectId);
  if (!project) {
    console.error(`Project with ID (or prefix) "${input.projectId}" not found.`);
    return null;
  }

  const now = new Date().toISOString();
  const newTask: Task = {
    id: uuidv4(),
    projectId: project.id,
    title: input.title,
    description: input.description || undefined,
    priority: input.priority,
    deadline: input.deadline || undefined,
    assignee: input.assignee || undefined,
    type: input.type,
    status: TaskStatus.Open,
    createdAt: now,
    updatedAt: now,
  };
  data.tasks.push(newTask);
  saveData(data);
  return newTask;
};

export const getAllTasks = (projectId?: string): Task[] => {
  const data = loadData();
  if (projectId) {
    const project = getProjectById(projectId);
    return project ? data.tasks.filter(t => t.projectId === project.id) : [];
  }
  return data.tasks;
};

export const getTaskById = (id: string): Task | undefined => {
  if (!id) return undefined;
  const data = loadData();
  let task = data.tasks.find(t => t.id === id);
  if (!task) {
      task = data.tasks.find(t => t.id.startsWith(id));
  }
  return task;
};

export const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>): Task | undefined => {
  const data = loadData();
  const taskIndex = data.tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return undefined;

  if (updates.description === '') updates.description = undefined;
  if (updates.assignee === '') updates.assignee = undefined;
  if (updates.deadline === '') updates.deadline = undefined;


  data.tasks[taskIndex] = {
    ...data.tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveData(data);
  return data.tasks[taskIndex];
};

export const deleteTask = (id: string): boolean => {
  const data = loadData();
  const taskToDelete = getTaskById(id);
  if (!taskToDelete) return false;

  const initialLength = data.tasks.length;
  data.tasks = data.tasks.filter(t => t.id !== taskToDelete.id);
  
  if (data.tasks.length < initialLength) {
    saveData(data);
    return true;
  }
  return false;
};