"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringInput = getStringInput;
exports.getNumericInput = getNumericInput;
const readline_sync_1 = __importDefault(require("readline-sync"));
function getStringInput(promptMessage) {
    return readline_sync_1.default.question(promptMessage).trim();
}
function getNumericInput(promptMessage) {
    const input = getStringInput(promptMessage);
    if (input === '') {
        console.warn('⚠️  Đầu vào không được để trống.');
        return null;
    }
    const numericValue = parseInt(input, 10);
    if (isNaN(numericValue)) {
        console.error('❌ Lỗi: Đầu vào không phải là một số hợp lệ. Vui lòng nhập lại.');
        return null;
    }
    return numericValue;
}
