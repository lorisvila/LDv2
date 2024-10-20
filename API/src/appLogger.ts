import pino, {Logger} from "pino";
import * as fs from "fs";
import {ConfigType} from "./types/types";

export class AppLogger {

    private logger: Logger;
    private childLoggers: Logger[] = [];

    constructor(config: ConfigType) {

        if (!fs.existsSync('./logs/')) { // Create log folder if not exists
            fs.mkdirSync('./logs/');
        }

        this.logger = pino(
            {
                level: config ? config.logging.GLOBAL_LOG_LEVEL : "info", // Set log level
                transport: {
                    targets: [
                        {
                            target: 'pino/file', // Output to a file
                            options: { destination: './logs/error.log' },
                            level: 'error', // Log level for file output
                        },
                        {
                            target: 'pino/file', // Output to a file
                            options: { destination: './logs/app.log' },
                            level: config ? config.logging.FILE_LOG_LEVEL : "info", // Log level for file output
                        },
                        {
                            target: 'pino-pretty', // Pretty-print for console
                            options: {
                                colorize: true, // Colorize the output
                                translateTime: 'yyyy-mm-dd HH:MM:ss.l', // Format timestamp
                                ignore: 'pid,hostname', // Ignore certain fields in the console output
                                hideObject: 'module'
                            },
                            level: config ? config.logging.CONSOLE_LOG_LEVEL : "info", // Log level for pretty console
                        }
                    ],
                },
            }
        );
    }

    getLogger(): Logger {
        return this.logger;
    }

    createChildLogger(moduleName: string): Logger {
        let childLogger = this.logger.child({module: moduleName})
        this.childLoggers = [...this.childLoggers, childLogger]
        return childLogger
    }

    getAllChildLoggers(): Logger[] {
        return this.childLoggers;
    }

}
