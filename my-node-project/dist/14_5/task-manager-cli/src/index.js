"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const menuFlows_1 = require("./flows/menuFlows");
const uiTexts_1 = require("./constants/uiTexts");
async function main() {
    try {
        await (0, menuFlows_1.mainMenuFlow)();
        process.exit(0);
    }
    catch (err) {
        console.clear();
        console.error((0, uiTexts_1.ERROR_STYLE)("\n❗❗❗ An Unexpected Error Occurred ❗❗❗"));
        if (err instanceof Error) {
            console.error(chalk_1.default.red(err.message));
            if (err.stack) {
                console.error((0, uiTexts_1.DIM_STYLE)(err.stack));
            }
        }
        else {
            console.error(chalk_1.default.red('An unknown error object was thrown:'), err);
        }
        console.log((0, uiTexts_1.INFO_STYLE)("\nPlease try restarting the application. If the problem persists, check the logs or report the issue."));
        process.exit(1);
    }
}
main();
