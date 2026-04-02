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

export interface EnvCheckComponent {
  name: string;
  installed: boolean;
  version?: string;
}

export interface EnvironmentCheckResult {
  ok: boolean;
  components: EnvCheckComponent[];
  message?: string;
}

export interface DashboardState {
  status: SystemStatus;
  metrics: ResourceMetrics;
  isLoading: boolean;
  error: string | null;
  envCheck: EnvironmentCheckResult | null;
}

export interface DashboardActions {
  refreshStatus: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  startService: () => Promise<void>;
  stopService: () => Promise<void>;
  restartService: () => Promise<void>;
  openConfig: () => void;
  setError: (error: string | null) => void;
  clearEnvCheck: () => void;
}

export type DashboardStore = DashboardState & DashboardActions;

export interface DashboardAPI {
  getStatus: () => Promise<SystemStatus>;
  getMetrics: () => Promise<ResourceMetrics>;
  startService: () => Promise<void>;
  stopService: () => Promise<void>;
  restartService: () => Promise<void>;
  checkEnvironment: () => Promise<EnvironmentCheckResult>;
}

export interface SystemAPI {
  exec: (command: string) => Promise<{ success: boolean; output: string | null; error?: string }>;
  installOpenClaw: () => Promise<{ success: boolean; error?: string; solution?: string }>;
  onInstallLog: (callback: (line: string) => void) => void;
  onInstallPhase: (callback: (phase: string) => void) => void;
  removeInstallListeners: () => void;
  readConfig: () => Promise<{ success: boolean; data: object | null; error?: string }>;
  writeConfig: (config: object) => Promise<{ success: boolean; error?: string }>;
}

export interface LogsAPI {
  queryLogs: (filter?: Partial<import('./logs').LogFilter> & { limit?: number; offset?: number }) => Promise<import('./logs').LogEntry[]>;
  clearLogs: () => Promise<void>;
  getLogCount: (filter?: Partial<import('./logs').LogFilter>) => Promise<number>;
  exportLogs: (filter?: Partial<import('./logs').LogFilter>) => Promise<string>;
}

export interface MigrateIpcAPI {
  scan: () => Promise<{ success: boolean; categories: import('./migrate').MigrateCategory[]; error?: string }>;
  pack: (categories: string[]) => Promise<{ success: boolean; filePath?: string; filename?: string; size?: number; error?: string }>;
  importZip: () => Promise<{ success: boolean; restoredCategories?: string[]; fileCount?: number; error?: string }>;
  onProgress: (callback: (progress: number) => void) => void;
  removeProgressListener: () => void;
}

export interface IElectronAPI {
  dashboard: DashboardAPI;
  system: SystemAPI;
  logs: LogsAPI;
  migrate: MigrateIpcAPI;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
