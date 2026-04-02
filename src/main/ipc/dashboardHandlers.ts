import { ipcMain, app } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import { SystemStatus, ResourceMetrics, EnvironmentCheckResult } from '@common/types/dashboard';
import {
  getGatewayStatus,
  getNodeStatus,
  getMemoryInfo,
  getActiveSkillsCount,
  getMockSkillsCount,
} from '../monitoring';
import { logger } from '../logger';

const execAsync = promisify(exec);

let appStartTime = Date.now();

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

function getLoginShell(): string {
  return process.env.SHELL || '/bin/bash';
}

async function execInShell(command: string): Promise<string> {
  try {
    const { stdout } = await execAsync(command);
    return stdout.trim();
  } catch {
    if (os.platform() === 'darwin' || os.platform() === 'linux') {
      const shell = getLoginShell();
      const { stdout } = await execAsync(`${shell} -lc "${command}"`);
      return stdout.trim();
    }
    throw new Error(`Command failed: ${command}`);
  }
}

async function getSystemStatus(): Promise<SystemStatus> {
  try {
    const gatewayStatus = await getGatewayStatus();
    const nodeStatus = await getNodeStatus();

    let overall: 'running' | 'stopped' | 'error';
    if (gatewayStatus === 'running') {
      overall = 'running';
    } else if (gatewayStatus === 'stopped') {
      overall = 'stopped';
    } else {
      overall = 'error';
    }

    return {
      gateway: gatewayStatus === 'running' ? 'running' : 'stopped',
      node: nodeStatus === 'connected' ? 'connected' : 'disconnected',
      overall,
    };
  } catch (error) {
    console.error('Error getting system status:', error);
    return {
      gateway: 'stopped',
      node: 'disconnected',
      overall: 'stopped',
    };
  }
}

async function getResourceMetrics(): Promise<ResourceMetrics> {
  try {
    const uptimeSeconds = Math.floor((Date.now() - appStartTime) / 1000);
    const memoryInfo = getMemoryInfo();

    let activeSkills = await getActiveSkillsCount();
    if (activeSkills === 0) {
      activeSkills = getMockSkillsCount();
    }

    return {
      version: app.getVersion(),
      uptime: uptimeSeconds,
      uptimeFormatted: formatUptime(uptimeSeconds),
      memory: {
        used: memoryInfo.appUsed,
        total: memoryInfo.total,
        percentage: memoryInfo.percentage,
      },
      activeSkills,
    };
  } catch (error) {
    console.error('Error getting resource metrics:', error);
    const uptimeSeconds = Math.floor((Date.now() - appStartTime) / 1000);
    return {
      version: app.getVersion(),
      uptime: uptimeSeconds,
      uptimeFormatted: formatUptime(uptimeSeconds),
      memory: {
        used: 0,
        total: 0,
        percentage: 0,
      },
      activeSkills: 0,
    };
  }
}

async function checkEnvironment(): Promise<EnvironmentCheckResult> {
  const components: EnvironmentCheckResult['components'] = [];

  let nodeInstalled = false;
  let nodeVersion: string | undefined;
  try {
    const output = await execInShell('node -v');
    const match = output.match(/v?\d+\.\d+\.\d+/);
    if (match) {
      nodeInstalled = true;
      nodeVersion = match[0];
    }
  } catch { /* not installed */ }
  components.push({ name: 'Node.js', installed: nodeInstalled, version: nodeVersion });

  let openclawInstalled = false;
  let openclawVersion: string | undefined;
  try {
    const output = await execInShell('openclaw --version');
    const match = output.match(/v?\d+\.\d+\.\d+/);
    if (match) {
      openclawInstalled = true;
      openclawVersion = match[0];
    } else if (output.length > 0) {
      openclawInstalled = true;
      openclawVersion = output.split('\n').pop();
    }
  } catch { /* not installed */ }
  components.push({ name: 'OpenClaw CLI', installed: openclawInstalled, version: openclawVersion });

  const allInstalled = components.every((c) => c.installed);
  const missing = components.filter((c) => !c.installed).map((c) => c.name);

  return {
    ok: allInstalled,
    components,
    message: allInstalled
      ? undefined
      : `Missing: ${missing.join(', ')}`,
  };
}

export function registerDashboardHandlers(): void {
  ipcMain.handle('dashboard:status', async (): Promise<SystemStatus> => {
    return getSystemStatus();
  });

  ipcMain.handle('dashboard:metrics', async (): Promise<ResourceMetrics> => {
    return getResourceMetrics();
  });

  ipcMain.handle('dashboard:check-env', async (): Promise<EnvironmentCheckResult> => {
    return checkEnvironment();
  });

  ipcMain.handle('dashboard:start', async (): Promise<void> => {
    logger.info('Gateway start requested', 'gateway');
    try {
      await execInShell('openclaw gateway start');
      appStartTime = Date.now();
      logger.info('Gateway started successfully', 'gateway');
    } catch (error) {
      logger.error(`Failed to start gateway: ${(error as Error).message}`, 'gateway');
      throw new Error(`Failed to start gateway: ${(error as Error).message}`);
    }
  });

  ipcMain.handle('dashboard:stop', async (): Promise<void> => {
    logger.info('Gateway stop requested', 'gateway');
    try {
      await execInShell('openclaw gateway stop');
      logger.info('Gateway stopped successfully', 'gateway');
    } catch (error) {
      logger.error(`Failed to stop gateway: ${(error as Error).message}`, 'gateway');
      throw new Error(`Failed to stop gateway: ${(error as Error).message}`);
    }
  });

  ipcMain.handle('dashboard:restart', async (): Promise<void> => {
    logger.info('Gateway restart requested', 'gateway');
    try {
      await execInShell('openclaw gateway restart');
      appStartTime = Date.now();
      logger.info('Gateway restarted successfully', 'gateway');
    } catch (error) {
      logger.error(`Failed to restart gateway: ${(error as Error).message}`, 'gateway');
      throw new Error(`Failed to restart gateway: ${(error as Error).message}`);
    }
  });
}
