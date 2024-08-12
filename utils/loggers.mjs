// loggers.mjs
import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, printf, label, errors } = format;

// Custom format for logging with label
const logFormat = printf(({ level, message, timestamp, stack, label }) => {
  return `${timestamp} [${label}] ${level}: ${stack || message}`;
});

// Function to create a custom logger with a specific label
const createCustomLogger = (labelName) => {
  return createLogger({
    level: 'info',
    format: combine(
      label({ label: labelName }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat
    ),
    transports: [
      new transports.File({ filename: path.join('logs',`${labelName}-error.log`), level: 'error' }),
      new transports.File({ filename: path.join('logs','combined.log') }),
    ],
  });
};

// Create loggers for each category
const logger = createCustomLogger('default');
const mscLogger = createCustomLogger('msc');
const arkasLogger = createCustomLogger('arkas');
const onelineLogger = createCustomLogger('oneline');
const evergreenLogger = createCustomLogger('evergreen');

// Add console transport if not in production
if (process.env.NODE_ENV !== 'production') {
  const consoleTransport = new transports.Console({
    format: format.simple(),
  });
  logger.add(consoleTransport);
  mscLogger.add(consoleTransport);
  arkasLogger.add(consoleTransport);
  onelineLogger.add(consoleTransport);
  evergreenLogger.add(consoleTransport);
}

export { mscLogger, arkasLogger, onelineLogger, evergreenLogger, logger };
