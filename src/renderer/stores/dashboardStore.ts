import { create } from 'zustand';
import { DashboardStore, SystemStatus, ResourceMetrics } from '@common/types/dashboard';
import { dashboardService } from '../services/monitoringService';
import { useNavigationStore } from './navigationStore';

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

const initialStatus: SystemStatus = {
  gateway: 'stopped',
  node: 'disconnected',
  overall: 'stopped',
};

const initialMetrics: ResourceMetrics = {
  version: 'v0.12.3',
  uptime: 0,
  uptimeFormatted: '0d 0h 0m',
  memory: {
    used: 0,
    total: 0,
    percentage: 0,
  },
  activeSkills: 0,
};

let loadingCount = 0;

function beginLoading(set: (partial: Partial<DashboardStore>) => void): void {
  loadingCount++;
  set({ isLoading: true, error: null });
}

function endLoading(set: (partial: Partial<DashboardStore>) => void): void {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0) {
    set({ isLoading: false });
  }
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  status: initialStatus,
  metrics: initialMetrics,
  isLoading: false,
  error: null,
  envCheck: null,

  refreshStatus: async () => {
    try {
      beginLoading(set);
      const status = await dashboardService.getStatus();
      set({ status });
    } catch (error) {
      console.error('Failed to refresh status:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch status',
      });
    } finally {
      endLoading(set);
    }
  },

  refreshMetrics: async () => {
    try {
      beginLoading(set);
      const metrics = await dashboardService.getMetrics();
      set({
        metrics: {
          ...metrics,
          uptimeFormatted: formatUptime(metrics.uptime),
        },
      });
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch metrics',
      });
    } finally {
      endLoading(set);
    }
  },

  startService: async () => {
    const currentStatus = get().status;

    if (currentStatus.gateway === 'running' && currentStatus.overall === 'running') {
      set({ error: 'Service is already running' });
      return;
    }

    try {
      beginLoading(set);

      const envResult = await dashboardService.checkEnvironment();
      set({ envCheck: envResult });

      if (!envResult.ok) {
        set({
          error: envResult.message || 'Environment check failed',
        });
        endLoading(set);
        return;
      }

      await dashboardService.startService();
      set({ envCheck: null });

      const status = await dashboardService.getStatus();
      const metrics = await dashboardService.getMetrics();
      set({
        status,
        metrics: { ...metrics, uptimeFormatted: formatUptime(metrics.uptime) },
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to start service',
      });
    } finally {
      endLoading(set);
    }
  },

  stopService: async () => {
    const currentStatus = get().status;

    if (currentStatus.gateway === 'stopped' && currentStatus.overall === 'stopped') {
      set({ error: 'Service is already stopped' });
      return;
    }

    try {
      beginLoading(set);
      await dashboardService.stopService();
      const status = await dashboardService.getStatus();
      const metrics = await dashboardService.getMetrics();
      set({
        status,
        metrics: { ...metrics, uptimeFormatted: formatUptime(metrics.uptime) },
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to stop service',
      });
    } finally {
      endLoading(set);
    }
  },

  restartService: async () => {
    try {
      beginLoading(set);

      const envResult = await dashboardService.checkEnvironment();
      set({ envCheck: envResult });

      if (!envResult.ok) {
        set({
          error: envResult.message || 'Environment check failed',
        });
        endLoading(set);
        return;
      }

      await dashboardService.restartService();
      set({ envCheck: null });

      const status = await dashboardService.getStatus();
      const metrics = await dashboardService.getMetrics();
      set({
        status,
        metrics: { ...metrics, uptimeFormatted: formatUptime(metrics.uptime) },
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to restart service',
      });
    } finally {
      endLoading(set);
    }
  },

  openConfig: () => {
    useNavigationStore.getState().navigate('config');
  },

  setError: (error) => set({ error }),

  clearEnvCheck: () => set({ envCheck: null }),
}));
