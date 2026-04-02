import { insertLog } from './database';
import type { LogLevel } from '@common/types/logs';

function log(level: LogLevel, message: string, source?: string): void {
  try {
    insertLog(level, message, source);
  } catch (err) {
    console.error('[Logger] Failed to write to database:', err);
  }

  const prefix = `[${new Date().toISOString()}] [${level.toUpperCase()}]${source ? ` [${source}]` : ''}`;
  switch (level) {
    case 'error':
      console.error(prefix, message);
      break;
    case 'warn':
      console.warn(prefix, message);
      break;
    case 'debug':
      console.debug(prefix, message);
      break;
    default:
      console.log(prefix, message);
      break;
  }
}

export const logger = {
  info(message: string, source?: string): void {
    log('info', message, source);
  },
  warn(message: string, source?: string): void {
    log('warn', message, source);
  },
  error(message: string, source?: string): void {
    log('error', message, source);
  },
  debug(message: string, source?: string): void {
    log('debug', message, source);
  },
};

export { queryLogs, clearLogs, getLogCount, exportLogsAsText, closeDatabase } from './database';
export type { LogQueryFilter, LogRow } from './database';
