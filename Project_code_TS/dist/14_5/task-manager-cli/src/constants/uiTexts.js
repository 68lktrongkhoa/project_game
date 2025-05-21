"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUCCESS_STYLE = exports.DIM_STYLE = exports.INFO_STYLE = exports.ERROR_STYLE = exports.MENU_HEADER_STYLE = exports.TITLE_STYLE = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.TITLE_STYLE = chalk_1.default.blueBright.bold;
exports.MENU_HEADER_STYLE = chalk_1.default.yellow.bold;
exports.ERROR_STYLE = chalk_1.default.redBright.bold;
exports.INFO_STYLE = chalk_1.default.yellow;
exports.DIM_STYLE = chalk_1.default.dim;
exports.SUCCESS_STYLE = chalk_1.default.greenBright.bold;
