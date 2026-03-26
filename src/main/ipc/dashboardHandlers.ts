import { ipcMain, app } from 'electron';
import { SystemStatus, ResourceMetrics } from '@common/types/dashboard';
import {
  getGatewayStatus,
  getNodeStatus,
  getMemoryInfo,
  getActiveSkillsCount,
  getMockSkillsCount,
} from '../monitoring';

let appStartTime = Date.now();

/**
 * Format uptime in seconds to human-readable format
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

/**
 * Get system status from real monitoring data
 */
async function getSystemStatus(): Promise<SystemStatus> {
  try {
    const gatewayStatus = await getGatewayStatus();
    const nodeStatus = await getNodeStatus();

    // Determine overall status
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

/**
 * Get resource metrics from real monitoring data
 */
async function getResourceMetrics(): Promise<ResourceMetrics> {
  try {
    const uptimeSeconds = Math.floor((Date.now() - appStartTime) / 1000);

    // Get memory info
    const memoryInfo = getMemoryInfo();

    // Get active skills count
    let activeSkills = await getActiveSkillsCount();
    // If Gateway not available, use mock for demo
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
    // Return fallback data
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

export function registerDashboardHandlers(): void {
  ipcMain.handle('dashboard:status', async (): Promise<SystemStatus> => {
    return getSystemStatus();
  });

  ipcMain.handle('dashboard:metrics', async (): Promise<ResourceMetrics> => {
    return getResourceMetrics();
  });

  ipcMain.handle('dashboard:stop', async (): Promise<void> => {
    // In a real implementation, this would send a stop command to Gateway
    console.log('Stop service requested');
  });

  ipcMain.handle('dashboard:restart', async (): Promise<void> => {
    // In a real implementation, this would send a restart command to Gateway
    console.log('Restart service requested');
    appStartTime = Date.now();
  });
}
