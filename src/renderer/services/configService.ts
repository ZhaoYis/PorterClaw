/**
 * Config Service
 * Checks OpenClaw installation status and provides gateway control
 */

import type { OpenClawInfo, GatewayAction, GatewayServiceStatus, OpenClawConfig } from '@common/types/config';
import { isElectronEnvironment } from './monitoringService';

function getGatewayBase(): string {
  try {
    const stored = localStorage.getItem('porterclaw_settings');
    if (stored) {
      const settings = JSON.parse(stored);
      const host = settings.gatewayHost || 'localhost';
      const port = settings.gatewayPort || 18789;
      return `http://${host}:${port}`;
    }
  } catch { /* ignore */ }
  return 'http://localhost:18789';
}

async function fetchWithTimeout(url: string, timeoutMs = 3000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Check if OpenClaw is installed (web mode: check gateway API)
 */
export async function checkOpenClawInstalled(): Promise<OpenClawInfo> {
  if (isElectronEnvironment()) {
    // Electron mode would execute `openclaw --version`
    return {
      installed: false,
      version: '',
      configPath: '~/.openclaw/openclaw.json',
    };
  }

  // Web mode: try to reach the gateway
  const base = getGatewayBase();
  try {
    const response = await fetchWithTimeout(`${base}/api/v1/status`, 2000);
    if (response.ok) {
      const data = await response.json();
      return {
        installed: true,
        version: data.version || 'unknown',
        configPath: '~/.openclaw/openclaw.json',
      };
    }
  } catch {
    // not reachable
  }

  return {
    installed: false,
    version: '',
    configPath: '~/.openclaw/openclaw.json',
  };
}

/**
 * Check gateway status
 */
export async function checkGatewayStatus(): Promise<GatewayServiceStatus> {
  const base = getGatewayBase();
  try {
    const endpoints = [`${base}/health`, `${base}/api/v1/status`, `${base}/`];
    for (const endpoint of endpoints) {
      try {
        const response = await fetchWithTimeout(endpoint, 2000);
        if (response.ok || response.status < 500) {
          return 'running';
        }
      } catch {
        continue;
      }
    }
    return 'stopped';
  } catch {
    return 'unknown';
  }
}

/**
 * Execute a gateway action (web mode: show command only)
 */
export async function executeGatewayAction(action: GatewayAction): Promise<string> {
  const commands: Record<GatewayAction, string> = {
    start: 'openclaw gateway start',
    stop: 'openclaw gateway stop',
    restart: 'openclaw gateway restart',
    status: 'openclaw gateway status',
    install: 'openclaw gateway install',
    uninstall: 'openclaw gateway uninstall',
  };

  if (isElectronEnvironment()) {
    // Electron would run the actual command
    return `Executing: ${commands[action]}`;
  }

  // Web mode: return the command for user reference
  return `[Web Mode] Run manually: ${commands[action]}`;
}

/**
 * Load OpenClaw config (simulated in web mode)
 */
export async function loadOpenClawConfig(): Promise<OpenClawConfig> {
  const base = getGatewayBase();
  try {
    const response = await fetchWithTimeout(`${base}/api/v1/config`, 2000);
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // fallback
  }

  // Default config structure
  let port = 18789;
  let host = 'localhost';
  try {
    const stored = localStorage.getItem('porterclaw_settings');
    if (stored) {
      const s = JSON.parse(stored);
      port = s.gatewayPort || 18789;
      host = s.gatewayHost || 'localhost';
    }
  } catch { /* ignore */ }

  return {
    gateway: {
      port,
      host,
      daemon: false,
    },
  };
}

/**
 * Run openclaw doctor
 */
export async function runDoctor(): Promise<string> {
  if (isElectronEnvironment()) {
    return 'Running openclaw doctor --fix...';
  }
  return '[Web Mode] Run manually: openclaw doctor --fix';
}

/**
 * Get install command for current platform
 */
export function getInstallCommand(): string {
  const isMac = navigator.platform.toLowerCase().includes('mac');
  const isWin = navigator.platform.toLowerCase().includes('win');

  if (isWin) {
    return 'iwr -useb https://openclaw.ai/install.ps1 | iex';
  }
  return 'curl -fsSL https://openclaw.ai/install.sh | bash';
}
