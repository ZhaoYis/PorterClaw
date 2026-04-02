import { create } from 'zustand';
import type { LogsStore, LogEntry, LogFilter } from '@common/types/logs';
import { fetchLogs, clearLogsRemote, exportLogsRemote, downloadLogs } from '../services/logsService';
import { isElectronEnvironment } from '../services/monitoringService';

function applyFilter(entries: LogEntry[], filter: LogFilter): LogEntry[] {
  let result = [...entries];

  if (filter.level !== 'all') {
    result = result.filter((e) => e.level === filter.level);
  }

  if (filter.timeRange !== 'all') {
    const now = Date.now();
    const ranges: Record<string, number> = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
    };
    const cutoff = now - (ranges[filter.timeRange] || 0);
    result = result.filter((e) => new Date(e.timestamp).getTime() >= cutoff);
  }

  if (filter.search.trim()) {
    const search = filter.search.toLowerCase();
    result = result.filter(
      (e) =>
        e.message.toLowerCase().includes(search) ||
        e.source?.toLowerCase().includes(search)
    );
  }

  return result;
}

export const useLogsStore = create<LogsStore>((set, get) => ({
  entries: [],
  filteredEntries: [],
  filter: {
    level: 'all',
    timeRange: 'all',
    search: '',
  },
  isLoading: false,
  autoScroll: true,
  error: null,

  loadLogs: async () => {
    try {
      set({ isLoading: true, error: null });
      const filter = get().filter;

      if (isElectronEnvironment()) {
        // In Electron, push filtering to SQLite for efficiency
        const entries = await fetchLogs({
          level: filter.level === 'all' ? undefined : filter.level,
          timeRange: filter.timeRange === 'all' ? undefined : filter.timeRange,
          search: filter.search || undefined,
          limit: 2000,
        });
        set({ entries, filteredEntries: entries, isLoading: false });
      } else {
        // Web mode: fetch all then filter client-side
        const entries = await fetchLogs();
        const filtered = applyFilter(entries, filter);
        set({ entries, filteredEntries: filtered, isLoading: false });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load logs',
      });
    }
  },

  setFilter: (partial) => {
    const filter = { ...get().filter, ...partial };
    set({ filter });

    // Re-fetch from database with new filter
    const store = get();
    if (isElectronEnvironment()) {
      store.loadLogs();
    } else {
      const filtered = applyFilter(store.entries, filter);
      set({ filteredEntries: filtered });
    }
  },

  clearLogs: async () => {
    try {
      await clearLogsRemote();
      set({ entries: [], filteredEntries: [] });
    } catch {
      set({ entries: [], filteredEntries: [] });
    }
  },

  exportLogs: async () => {
    try {
      if (isElectronEnvironment()) {
        const filter = get().filter;
        const text = await exportLogsRemote({
          level: filter.level === 'all' ? undefined : filter.level,
          timeRange: filter.timeRange === 'all' ? undefined : filter.timeRange,
          search: filter.search || undefined,
        });

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `openclaw-logs-${new Date().toISOString().slice(0, 10)}.log`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        downloadLogs(get().filteredEntries);
      }
    } catch {
      downloadLogs(get().filteredEntries);
    }
  },

  toggleAutoScroll: () => {
    set({ autoScroll: !get().autoScroll });
  },

  setError: (error) => set({ error }),
}));
