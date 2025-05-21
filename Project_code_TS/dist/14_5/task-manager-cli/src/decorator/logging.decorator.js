"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMethodCalls = LogMethodCalls;
const chalk_1 = __importDefault(require("chalk"));
function LogMethodCalls(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const className = target.constructor.name;
        const timestamp = new Date().toISOString();
        console.log(chalk_1.default.dim(`[${timestamp}] ${chalk_1.default.cyanBright.bold(className)}.${chalk_1.default.yellowBright(propertyKey)} called with args: ${JSON.stringify(args)}`));
        let result;
        try {
            result = originalMethod.apply(this, args);
            if (result instanceof Promise) {
                return result
                    .then((promiseResult) => {
                    const returnTimestamp = new Date().toISOString();
                    console.log(chalk_1.default.dim(`[${returnTimestamp}] ${chalk_1.default.cyanBright.bold(className)}.${chalk_1.default.yellowBright(propertyKey)} (async) returned: ${JSON.stringify(promiseResult)}`));
                    return promiseResult;
                })
                    .catch((error) => {
                    const errorTimestamp = new Date().toISOString();
                    console.error(chalk_1.default.redBright.bold(`[${errorTimestamp}] ${chalk_1.default.cyanBright.bold(className)}.${chalk_1.default.yellowBright(propertyKey)} (async) threw error: ${error?.message || error}`));
                    throw error;
                });
            }
            else {
                const returnTimestamp = new Date().toISOString();
                console.log(chalk_1.default.dim(`[${returnTimestamp}] ${chalk_1.default.cyanBright.bold(className)}.${chalk_1.default.yellowBright(propertyKey)} returned: ${JSON.stringify(result)}`));
                return result;
            }
        }
        catch (error) {
            const errorTimestamp = new Date().toISOString();
            console.error(chalk_1.default.redBright.bold(`[${errorTimestamp}] ${chalk_1.default.cyanBright.bold(className)}.${chalk_1.default.yellowBright(propertyKey)} threw error: ${error?.message || error}`));
            throw error;
        }
    };
    return descriptor;
}
