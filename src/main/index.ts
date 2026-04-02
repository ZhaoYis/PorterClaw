import { app, BrowserWindow } from 'electron';
import path from 'path';
import { registerDashboardHandlers } from './ipc/dashboardHandlers';
import { registerSystemHandlers } from './ipc/systemHandlers';
import { registerLogsHandlers } from './ipc/logsHandlers';
import { registerMigrateHandlers } from './ipc/migrateHandlers';
import { logger, closeDatabase } from './logger';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js'),
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  logger.info('Main window created', 'app');
}

app.whenReady().then(() => {
  logger.info(`PorterClaw ${app.getVersion()} starting on ${process.platform}`, 'app');

  registerDashboardHandlers();
  registerSystemHandlers();
  registerLogsHandlers();
  registerMigrateHandlers();
  createWindow();

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  logger.info('Application shutting down', 'app');
  closeDatabase();
});
