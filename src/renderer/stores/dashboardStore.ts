import { create } from 'zustand';
import { DashboardStore, SystemStatus, ResourceMetrics } from '@common/types/dashboard';

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

const initialStatus: SystemStatus = {
  gateway: 'running',
  node: 'connected',
  overall: 'running',
};

const initialMetrics: ResourceMetrics = {
  version: 'v0.12.3',
  uptime: 187920,
  uptimeFormatted: '2d 4h 32m',
  memory: {
    used: 256,
    total: 1024,
    percentage: 25,
  },
  activeSkills: 12,
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  status: initialStatus,
  metrics: initialMetrics,
  isLoading: false,
  error: null,

  refreshStatus: async () => {
    try {
      set({ isLoading: true, error: null });
      const status = await window.electron.dashboard.getStatus();
      set({ status, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch status',
        isLoading: false
      });
    }
  },

  refreshMetrics: async () => {
    try {
      set({ isLoading: true, error: null });
      const metrics = await window.electron.dashboard.getMetrics();
      set({
        metrics: {
          ...metrics,
          uptimeFormatted: formatUptime(metrics.uptime),
        },
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch metrics',
        isLoading: false
      });
    }
  },

  stopService: async () => {
    try {
      set({ isLoading: true, error: null });
      await window.electron.dashboard.stopService();
      await get().refreshStatus();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to stop service',
        isLoading: false
      });
    }
  },

  restartService: async () => {
    try {
      set({ isLoading: true, error: null });
      await window.electron.dashboard.restartService();
      await get().refreshStatus();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to restart service',
        isLoading: false
      });
    }
  },

  openConfig: () => {
    console.log('Open config page');
  },

  setError: (error) => set({ error }),
}));
