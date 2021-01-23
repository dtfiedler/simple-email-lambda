import * as path from 'path';
import { createLogger, format, transports } from 'winston';
const { combine, errors, timestamp } = format;

const baseFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  format((info) => {
    info.level = info.level.toUpperCase();
    return info;
  })(),
);
const splunkFormat = combine(baseFormat, format.json());
const prettyFormat = combine(baseFormat, format.prettyPrint());

/**
 * Create the logger for splunk vs. prettier.
 * @param moduleName 
 */
const createCustomLogger = (moduleName) =>
  createLogger({
    level: process.env.LOG_LEVEL,
    format: process.env.PRETTY_LOGS ? prettyFormat : splunkFormat,
    defaultMeta: { module: path.basename(moduleName) },
    transports: [new transports.Console()],
  });

export { createCustomLogger };
