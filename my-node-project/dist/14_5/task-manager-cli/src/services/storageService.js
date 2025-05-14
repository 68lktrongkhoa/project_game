"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveData = exports.loadData = void 0;
// src/services/storageService.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Tạo đường dẫn đến file db.json trong thư mục data/ ở gốc dự án
const DATA_FILE_PATH = path_1.default.join(__dirname, '..', '..', 'data', 'db.json');
const ensureDataFileExists = () => {
    const dataDir = path_1.default.dirname(DATA_FILE_PATH);
    if (!fs_1.default.existsSync(dataDir)) {
        fs_1.default.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs_1.default.existsSync(DATA_FILE_PATH)) {
        const initialData = { projects: [], tasks: [] };
        fs_1.default.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
        console.log(`Initialized empty data file at: ${DATA_FILE_PATH}`);
    }
};
const loadData = () => {
    ensureDataFileExists();
    try {
        const jsonData = fs_1.default.readFileSync(DATA_FILE_PATH, 'utf-8');
        if (jsonData.trim() === '') {
            const initialData = { projects: [], tasks: [] };
            fs_1.default.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
            return initialData;
        }
        return JSON.parse(jsonData);
    }
    catch (error) {
        console.error("Error loading data, initializing with empty structure.", error);
        const initialData = { projects: [], tasks: [] };
        fs_1.default.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
        return initialData;
    }
};
exports.loadData = loadData;
const saveData = (data) => {
    ensureDataFileExists();
    try {
        fs_1.default.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    }
    catch (error) {
        console.error("Error saving data:", error);
    }
};
exports.saveData = saveData;
