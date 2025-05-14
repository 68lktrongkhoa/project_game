// src/services/storageService.ts
import fs from 'fs';
import path from 'path';
import { AppData } from '../types';

// Tạo đường dẫn đến file db.json trong thư mục data/ ở gốc dự án
const DATA_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'db.json');


const ensureDataFileExists = (): void => {
  const dataDir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE_PATH)) {
    const initialData: AppData = { projects: [], tasks: [] };
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    console.log(`Initialized empty data file at: ${DATA_FILE_PATH}`);
  }
};

export const loadData = (): AppData => {
  ensureDataFileExists();
  try {
    const jsonData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    if (jsonData.trim() === '') {
        const initialData: AppData = { projects: [], tasks: [] };
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
        return initialData;
    }
    return JSON.parse(jsonData) as AppData;
  } catch (error) {
    console.error("Error loading data, initializing with empty structure.", error);
    const initialData: AppData = { projects: [], tasks: [] };
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
};

export const saveData = (data: AppData): void => {
  ensureDataFileExists();
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error saving data:", error);
  }
};