import chalk from 'chalk';

export function LogMethodCalls(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    const originalMethod = descriptor.value; 

    descriptor.value = function (...args: any[]) {
        const className = target.constructor.name;
        const timestamp = new Date().toISOString();
        console.log(
            chalk.dim(`[${timestamp}] ${chalk.cyanBright.bold(className)}.${chalk.yellowBright(propertyKey)} called with args: ${JSON.stringify(args)}`)
        );

        let result: any;
        try {
            result = originalMethod.apply(this, args);
            if (result instanceof Promise) {
                return result
                    .then((promiseResult: any) => {
                        const returnTimestamp = new Date().toISOString();
                        console.log(
                            chalk.dim(`[${returnTimestamp}] ${chalk.cyanBright.bold(className)}.${chalk.yellowBright(propertyKey)} (async) returned: ${JSON.stringify(promiseResult)}`)
                        );
                        return promiseResult;
                    })
                    .catch((error: any) => {
                        const errorTimestamp = new Date().toISOString();
                        console.error(
                            chalk.redBright.bold(`[${errorTimestamp}] ${chalk.cyanBright.bold(className)}.${chalk.yellowBright(propertyKey)} (async) threw error: ${error?.message || error}`)
                        );
                        throw error; 
                    });
            } else {
                const returnTimestamp = new Date().toISOString();
                console.log(
                    chalk.dim(`[${returnTimestamp}] ${chalk.cyanBright.bold(className)}.${chalk.yellowBright(propertyKey)} returned: ${JSON.stringify(result)}`)
                );
                return result;
            }
        } catch (error: any) {
            const errorTimestamp = new Date().toISOString();
            console.error(
                chalk.redBright.bold(`[${errorTimestamp}] ${chalk.cyanBright.bold(className)}.${chalk.yellowBright(propertyKey)} threw error: ${error?.message || error}`)
            );
            throw error;
        }
    };

    return descriptor;
}