import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Custom log format
const customFormat = winston.format.printf(
  ({ timestamp, level, label, message, stack }) => {
    const logLabel = label ? ` - ${label}` : "";
    const logMessage = stack || message;
    return `${timestamp} - ${level.toUpperCase()}${logLabel} - ${logMessage}`;
  },
);

// Daily rotate file transport
const dailyRotateFileTransport = new DailyRotateFile({
  filename: "logs/tring_admin-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

// Create the Winston logger
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    winston.format.errors({ stack: true }),
    customFormat,
  ),
  transports: [new winston.transports.Console(), dailyRotateFileTransport],
});

const dailyRotateFileTransportForBilling = new DailyRotateFile({
  filename: "logs/billing/tring_admin-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});
export const billingLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    winston.format.errors({ stack: true }),
    customFormat,
  ),
  transports: [
    new winston.transports.Console(),
    dailyRotateFileTransportForBilling,
  ],
});
