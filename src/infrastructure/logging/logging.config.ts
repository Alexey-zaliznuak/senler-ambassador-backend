import * as winston from 'winston';
import * as Transport from 'winston-transport';
import { AppConfigType } from '../config/config.app-config';

export const LOGGER = 'WinstonLogger';

export const baseLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
    context = context;

    const logObject = {
      level,
      message,
      timestamp,
      context,
      meta,
    };

    return JSON.stringify(logObject);
  })
);

export const prettyLogStreamFormat = winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
  const formattedMessage = typeof message === 'object' ? JSON.stringify(message, null, 4) : message;
  const formattedMeta = meta && Object.keys(meta) ? JSON.stringify(meta, null, 4) : '';

  return `${timestamp} [${context || 'Application'}] ${level}: ${formattedMessage} ${formattedMeta}`;
});

export const prettyLogStreamFormatWithColorsAndDatetime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  prettyLogStreamFormat
);

export const baseTransports = (config: AppConfigType): Transport[] => [
  new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  }),
  // new winston.transports.Console({
  //   level: 'debug',
  //   format: prettyLogStreamFormatWithColorsAndDatetime,
  // }),
];
