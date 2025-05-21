
import inquirer from 'inquirer';
import { DIM_STYLE } from '../constants/uiTexts'; 

export async function pressEnterToContinue(): Promise<void> {
    await inquirer.prompt<{ continue: string }>({
        type: 'input',
        name: 'continue',
        message: DIM_STYLE('Press Enter to return to the menu...'),
        default: ''
    });
}