// src/services/projectService.ts
import { v4 as uuidv4 } from 'uuid';
import { Project, ProjectStatus, AppData } from '../types';
import { loadData, saveData } from './storageService';

export const createProject = (name: string, description?: string): Project => {
  const data = loadData();
  const now = new Date().toISOString();
  const newProject: Project = {
    id: uuidv4(),
    name,
    description: description || undefined,
    status: ProjectStatus.Active,
    createdAt: now,
    updatedAt: now,
  };
  data.projects.push(newProject);
  saveData(data);
  return newProject;
};

export const getAllProjects = (): Project[] => {
  const data = loadData();
  return data.projects;
};

export const getProjectById = (id: string): Project | undefined => {
  if (!id) return undefined;
  const data = loadData();
  let project = data.projects.find(p => p.id === id);
  if (!project) {
      project = data.projects.find(p => p.id.startsWith(id));
  }
  return project;
};

export const updateProject = (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Project | undefined => {
  const data = loadData();
  const projectIndex = data.projects.findIndex(p => p.id === id);
  if (projectIndex === -1) return undefined;

  if (updates.description === '') {
      updates.description = undefined;
  }


  data.projects[projectIndex] = {
    ...data.projects[projectIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveData(data);
  return data.projects[projectIndex];
};

export const deleteProject = (id: string): boolean => {
  const data = loadData();
  const projectToDelete = getProjectById(id);
  if (!projectToDelete) return false;

  const initialProjectsLength = data.projects.length;
  
  // Xóa dự án
  data.projects = data.projects.filter(p => p.id !== projectToDelete.id);
  
  const initialTasksLength = data.tasks.length;
  data.tasks = data.tasks.filter(t => t.projectId !== projectToDelete.id);
  
  if (data.projects.length < initialProjectsLength || data.tasks.length < initialTasksLength) {
    saveData(data);
    return true;
  }
  return false;
};