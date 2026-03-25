export interface SystemStatus {
  gateway: 'running' | 'stopped';
  node: 'connected' | 'disconnected';
  overall: 'running' | 'stopped' | 'error';
}

export interface ResourceMetrics {
  version: string;
  uptime: number;
  uptimeFormatted: string;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  activeSkills: number;
}

export interface DashboardState {
  status: SystemStatus;
  metrics: ResourceMetrics;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardActions {
  refreshStatus: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  stopService: () => Promise<void>;
  restartService: () => Promise<void>;
  openConfig: () => void;
  setError: (error: string | null) => void;
}

export type DashboardStore = DashboardState & DashboardActions;

export interface DashboardAPI {
  getStatus: () => Promise<SystemStatus>;
  getMetrics: () => Promise<ResourceMetrics>;
  stopService: () => Promise<void>;
  restartService: () => Promise<void>;
}

export interface IElectronAPI {
  dashboard: DashboardAPI;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
