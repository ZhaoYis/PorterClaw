import { ipcMain, BrowserWindow } from 'electron';
import { SystemStatus, ResourceMetrics } from '@common/types/dashboard';

let currentStatus: SystemStatus = {
  gateway: 'running',
  node: 'connected',
  overall: 'running',
};

let currentMetrics: ResourceMetrics = {
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

let uptimeStart = Date.now() - 187920 * 1000;

export function registerDashboardHandlers(): void {
  ipcMain.handle('dashboard:status', async (): Promise<SystemStatus> => {
    return currentStatus;
  });

  ipcMain.handle('dashboard:metrics', async (): Promise<ResourceMetrics> => {
    const uptimeSeconds = Math.floor((Date.now() - uptimeStart) / 1000);
    return {
      ...currentMetrics,
      uptime: uptimeSeconds,
    };
  });

  ipcMain.handle('dashboard:stop', async (): Promise<void> => {
    currentStatus = {
      gateway: 'stopped',
      node: 'disconnected',
      overall: 'stopped',
    };
  });

  ipcMain.handle('dashboard:restart', async (): Promise<void> => {
    currentStatus = {
      gateway: 'running',
      node: 'connected',
      overall: 'running',
    };
    uptimeStart = Date.now();
  });
}

export function registerWindowHandlers(mainWindow: BrowserWindow): void {
  ipcMain.handle('window:minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.handle('window:maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle('window:close', () => {
    mainWindow.close();
  });
}
