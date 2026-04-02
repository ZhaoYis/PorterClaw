import { contextBridge, ipcRenderer } from 'electron';
import { SystemStatus, ResourceMetrics, EnvironmentCheckResult } from '@common/types/dashboard';
import type { LogEntry, LogFilter } from '@common/types/logs';
import type { MigrateCategory } from '@common/types/migrate';

const dashboardAPI = {
  getStatus: (): Promise<SystemStatus> => ipcRenderer.invoke('dashboard:status'),
  getMetrics: (): Promise<ResourceMetrics> => ipcRenderer.invoke('dashboard:metrics'),
  startService: (): Promise<void> => ipcRenderer.invoke('dashboard:start'),
  stopService: (): Promise<void> => ipcRenderer.invoke('dashboard:stop'),
  restartService: (): Promise<void> => ipcRenderer.invoke('dashboard:restart'),
  checkEnvironment: (): Promise<EnvironmentCheckResult> => ipcRenderer.invoke('dashboard:check-env'),
};

const systemAPI = {
  exec: (command: string): Promise<{ success: boolean; output: string | null; error?: string }> => 
    ipcRenderer.invoke('system:exec', command),

  installOpenClaw: (): Promise<{ success: boolean; error?: string; solution?: string }> =>
    ipcRenderer.invoke('system:install-openclaw'),

  onInstallLog: (callback: (line: string) => void) => {
    const handler = (_: Electron.IpcRendererEvent, line: string) => callback(line);
    ipcRenderer.on('install:log', handler);
  },

  onInstallPhase: (callback: (phase: string) => void) => {
    const handler = (_: Electron.IpcRendererEvent, phase: string) => callback(phase);
    ipcRenderer.on('install:phase', handler);
  },

  removeInstallListeners: () => {
    ipcRenderer.removeAllListeners('install:log');
    ipcRenderer.removeAllListeners('install:phase');
  },

  readConfig: (): Promise<{ success: boolean; data: object | null; error?: string }> =>
    ipcRenderer.invoke('system:read-config'),

  writeConfig: (config: object): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('system:write-config', config),
};

const logsAPI = {
  queryLogs: (filter?: Partial<LogFilter> & { limit?: number; offset?: number }): Promise<LogEntry[]> =>
    ipcRenderer.invoke('logs:query', filter),

  clearLogs: (): Promise<void> =>
    ipcRenderer.invoke('logs:clear'),

  getLogCount: (filter?: Partial<LogFilter>): Promise<number> =>
    ipcRenderer.invoke('logs:count', filter),

  exportLogs: (filter?: Partial<LogFilter>): Promise<string> =>
    ipcRenderer.invoke('logs:export', filter),
};

const migrateAPI = {
  scan: (): Promise<{ success: boolean; categories: MigrateCategory[]; error?: string }> =>
    ipcRenderer.invoke('migrate:scan'),

  pack: (categories: string[]): Promise<{ success: boolean; filePath?: string; filename?: string; size?: number; error?: string }> =>
    ipcRenderer.invoke('migrate:pack', categories),

  importZip: (): Promise<{ success: boolean; restoredCategories?: string[]; fileCount?: number; error?: string }> =>
    ipcRenderer.invoke('migrate:import'),

  onProgress: (callback: (progress: number) => void) => {
    const handler = (_: Electron.IpcRendererEvent, progress: number) => callback(progress);
    ipcRenderer.on('migrate:progress', handler);
  },

  removeProgressListener: () => {
    ipcRenderer.removeAllListeners('migrate:progress');
  },
};

contextBridge.exposeInMainWorld('electron', {
  dashboard: dashboardAPI,
  system: systemAPI,
  logs: logsAPI,
  migrate: migrateAPI,
});
