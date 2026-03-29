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

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  status: initialStatus,
  metrics: initialMetrics,
  isLoading: false,
  error: null,

  refreshStatus: async () => {
    try {
      set({ isLoading: true, error: null });
      const status = await dashboardService.getStatus();
      set({ status, isLoading: false });
    } catch (error) {
      console.error('Failed to refresh status:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch status',
        isLoading: false,
      });
    }
  },

  refreshMetrics: async () => {
    try {
      set({ isLoading: true, error: null });
      const metrics = await dashboardService.getMetrics();
      set({
        metrics: {
          ...metrics,
          uptimeFormatted: formatUptime(metrics.uptime),
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch metrics',
        isLoading: false,
      });
    }
  },

  stopService: async () => {
    const currentStatus = get().status;

    // Check if service is already stopped
    if (currentStatus.gateway === 'stopped' && currentStatus.overall === 'stopped') {
      set({ error: 'Service is already stopped' });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      await dashboardService.stopService();
      // Refresh both status and metrics after stop
      const status = await dashboardService.getStatus();
      const metrics = await dashboardService.getMetrics();
      set({
        status,
        metrics: { ...metrics, uptimeFormatted: formatUptime(metrics.uptime) },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to stop service',
        isLoading: false,
      });
    }
  },

  restartService: async () => {
    try {
      set({ isLoading: true, error: null });
      await dashboardService.restartService();
      // Refresh both status and metrics after restart
      const status = await dashboardService.getStatus();
      const metrics = await dashboardService.getMetrics();
      set({
        status,
        metrics: { ...metrics, uptimeFormatted: formatUptime(metrics.uptime) },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to restart service',
        isLoading: false,
      });
    }
  },

  openConfig: () => {
    useNavigationStore.getState().navigate('config');
  },

  setError: (error) => set({ error }),
}));
