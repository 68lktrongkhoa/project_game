"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pressEnterToContinue = pressEnterToContinue;
const inquirer_1 = __importDefault(require("inquirer"));
const uiTexts_1 = require("../constants/uiTexts");
async function pressEnterToContinue() {
    await inquirer_1.default.prompt({
        type: 'input',
        name: 'continue',
        message: (0, uiTexts_1.DIM_STYLE)('Press Enter to return to the menu...'),
        default: ''
    });
}
