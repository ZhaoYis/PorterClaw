export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export type LogTimeRange = '1h' | '6h' | '24h' | '7d' | 'all';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source?: string;
}

export interface LogFilter {
  level: LogLevel | 'all';
  timeRange: LogTimeRange;
  search: string;
}

export interface LogsState {
  entries: LogEntry[];
  filteredEntries: LogEntry[];
  filter: LogFilter;
  isLoading: boolean;
  autoScroll: boolean;
  error: string | null;
}

export interface LogsActions {
  loadLogs: () => Promise<void>;
  setFilter: (filter: Partial<LogFilter>) => void;
  clearLogs: () => Promise<void>;
  exportLogs: () => Promise<void>;
  toggleAutoScroll: () => void;
  setError: (error: string | null) => void;
}

export type LogsStore = LogsState & LogsActions;
