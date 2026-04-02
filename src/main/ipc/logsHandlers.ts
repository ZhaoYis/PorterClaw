import { ipcMain } from 'electron';
import { queryLogs, clearLogs, getLogCount, exportLogsAsText } from '../logger';
import type { LogQueryFilter, LogRow } from '../logger';
import type { LogEntry } from '@common/types/logs';

function rowToEntry(row: LogRow): LogEntry {
  return {
    id: String(row.id),
    timestamp: row.timestamp,
    level: row.level as LogEntry['level'],
    message: row.message,
    source: row.source ?? undefined,
  };
}

export function registerLogsHandlers(): void {
  ipcMain.handle('logs:query', (_, filter?: LogQueryFilter): LogEntry[] => {
    const rows = queryLogs(filter);
    return rows.map(rowToEntry);
  });

  ipcMain.handle('logs:clear', (): void => {
    clearLogs();
  });

  ipcMain.handle('logs:count', (_, filter?: LogQueryFilter): number => {
    return getLogCount(filter);
  });

  ipcMain.handle('logs:export', (_, filter?: LogQueryFilter): string => {
    return exportLogsAsText(filter);
  });
}
