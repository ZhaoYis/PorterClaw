import { contextBridge, ipcRenderer } from 'electron';
import { SystemStatus, ResourceMetrics } from '@common/types/dashboard';

const dashboardAPI = {
  getStatus: (): Promise<SystemStatus> => ipcRenderer.invoke('dashboard:status'),
  getMetrics: (): Promise<ResourceMetrics> => ipcRenderer.invoke('dashboard:metrics'),
  stopService: (): Promise<void> => ipcRenderer.invoke('dashboard:stop'),
  restartService: (): Promise<void> => ipcRenderer.invoke('dashboard:restart'),
};

const systemAPI = {
  exec: (command: string): Promise<{ success: boolean; output: string | null; error?: string }> => 
    ipcRenderer.invoke('system:exec', command),
};

contextBridge.exposeInMainWorld('electron', {
  dashboard: dashboardAPI,
  system: systemAPI,
});
