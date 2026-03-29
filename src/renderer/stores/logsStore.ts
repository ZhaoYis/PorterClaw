import { create } from 'zustand';
import type { LogsStore, LogEntry, LogFilter } from '@common/types/logs';
import { fetchLogs, downloadLogs } from '../services/logsService';

function applyFilter(entries: LogEntry[], filter: LogFilter): LogEntry[] {
  let result = [...entries];

  // Level filter
  if (filter.level !== 'all') {
    result = result.filter((e) => e.level === filter.level);
  }

  // Time range filter
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

  // Search filter
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
      const entries = await fetchLogs();
      const filtered = applyFilter(entries, get().filter);
      set({ entries, filteredEntries: filtered, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load logs',
      });
    }
  },

  setFilter: (partial) => {
    const filter = { ...get().filter, ...partial };
    const filtered = applyFilter(get().entries, filter);
    set({ filter, filteredEntries: filtered });
  },

  clearLogs: () => {
    set({ entries: [], filteredEntries: [] });
  },

  exportLogs: () => {
    downloadLogs(get().filteredEntries);
  },

  toggleAutoScroll: () => {
    set({ autoScroll: !get().autoScroll });
  },

  setError: (error) => set({ error }),
}));
