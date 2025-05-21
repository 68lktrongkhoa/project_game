import chalk from 'chalk';
import { mainMenuFlow } from './flows/menuFlows';
import { ERROR_STYLE, INFO_STYLE, DIM_STYLE } from './constants/uiTexts';

async function main(): Promise<void> {
    try {
        await mainMenuFlow();
        process.exit(0);
    } catch (err: unknown) {
        console.clear();
        console.error(ERROR_STYLE("\n❗❗❗ An Unexpected Error Occurred ❗❗❗"));

        if (err instanceof Error) {
            console.error(chalk.red(err.message));
            if (err.stack) {
                console.error(DIM_STYLE(err.stack));
            }
        } else {
            console.error(chalk.red('An unknown error object was thrown:'), err);
        }

        console.log(INFO_STYLE("\nPlease try restarting the application. If the problem persists, check the logs or report the issue."));
        process.exit(1); 
    }
}

main();