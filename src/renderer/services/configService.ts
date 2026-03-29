/**
 * Config Service
 * Checks OpenClaw installation status and provides gateway control
 */

import type { OpenClawInfo, GatewayAction, GatewayServiceStatus, OpenClawConfig, EnvironmentStatus } from '@common/types/config';
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
  } catch (e) { console.error('Error fetching stored settings:', e); }
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
 * Assess the physical environment (Node.js, OpenClaw, OS)
 */
export async function checkSystemEnvironment(): Promise<EnvironmentStatus> {
  let osName = 'Unknown OS';
  const pf = navigator.platform.toLowerCase();
  if (pf.includes('win')) osName = 'Windows';
  else if (pf.includes('mac') || pf.includes('darwin')) osName = 'macOS';
  else if (pf.includes('linux')) osName = 'Linux';

  if (isElectronEnvironment()) {
    let nodeVersion = 'Unknown';
    let nodeInstalled = false;
    try {
      const result = await window.electron.system.exec('node -v');
      if (result.success && result.output) {
        nodeVersion = result.output;
        nodeInstalled = true;
      }
    } catch (e) {
      console.error('Failed to check Node.js version:', e);
      // ignore error, node simply isn't installed
    }

    return {
      os: osName,
      components: [
        { name: 'Node.js', installed: nodeInstalled, version: nodeVersion, requiredVersion: '>=18.0.0' },
        { name: 'Gateway', installed: false, requiredVersion: 'latest' }
      ]
    };
  }

  // Web Mode Simulation: Pretend Node.js is ready but Gateway is not installed
  await new Promise(r => setTimeout(r, 600)); // Simulate async check
  return {
    os: osName,
    components: [
      { name: 'Node.js', installed: true, version: 'v20.11.0', requiredVersion: '>=18.0.0' },
      { name: 'Gateway', installed: false, requiredVersion: 'latest' }
    ]
  };
}

/**
 * Check if OpenClaw is installed (web mode: check gateway API)
 */
export async function checkOpenClawInstalled(): Promise<OpenClawInfo> {
  if (isElectronEnvironment()) {
    try {
      // Use openclaw --version to verify OpenClaw is installed
      const result = await window.electron.system.exec('openclaw --version');
      if (result.success && result.output) {
        return {
          installed: true,
          version: result.output,
          configPath: '~/.openclaw/openclaw.json',
        };
      }
    } catch (e) {
      // ignore and safely fall through to not installed
    }
    
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
    // Electron runs the actual command via IPC
    const result = await window.electron.system.exec(commands[action]);
    if (!result.success) {
      throw new Error(result.error || `Failed to execute ${action}`);
    }
    return result.output || result.error || 'Done';
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
  } catch (e) { console.error('Error fetching stored settings:', e); }

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
    const result = await window.electron.system.exec('openclaw doctor --fix');
    if (!result.success) {
      throw new Error(result.error || 'Failed to run openclaw doctor');
    }
    return result.output || result.error || 'Done';
  }
  return '[Web Mode] Run manually: openclaw doctor --fix';
}

/**
 * Get install command for current platform
 */
export function getInstallCommand(): string {
  const isWin = navigator.platform.toLowerCase().includes('win');

  if (isWin) {
    return 'iwr -useb https://openclaw.ai/install.ps1 | iex';
  }
  return 'curl -fsSL https://openclaw.ai/install.sh | bash';
}

/**
 * Simulate automated installation with fake timings and log outputs.
 */
export async function simulateAutoInstall(
  onLog: (line: string) => void,
  onPhase: (phase: import('@common/types/config').InstallPhase) => void,
  simulateError = false
): Promise<void> {
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  try {
    // 1. Check Prereqs
    onPhase('checking_prereqs');
    onLog('> Checking system architecture...');
    await wait(400);
    onLog('System: OS X / Darwin, x64');
    onLog('> Checking Node.js requirement...');
    await wait(600);

    if (simulateError) {
      onLog('ERROR: Node.js is not installed locally and permission denied for auto-download.');
      onPhase('error');
      const err = new Error('Permission denied while verifying Node.js path');
      (err as any).solution = 'Try running PorterClaw as an Administrator, or manually install Node.js from https://nodejs.org/';
      throw err;
    }

    onLog('Node.js not found. Preparing to download...');
    await wait(500);

    // 2. Install Node
    onPhase('installing_node');
    onLog('> Downloading Node.js v20 LTS...');
    for (let i = 1; i <= 3; i++) {
      onLog(`Downloading... ${i * 33}%`);
      await wait(500);
    }
    onLog('> Extracting Node.js binaries...');
    await wait(800);
    onLog('Node.js verified and exported to isolated path.');

    // 3. Install OpenClaw
    onPhase('installing_openclaw');
    onLog('> npm install -g @openclaw/cli@latest');
    await wait(800);
    onLog('fetchMetadata: sill resolveWithNewModule @openclaw/cli@latest');
    await wait(400);
    onLog('added 123 packages, and audited 124 packages in 4s');
    onLog('found 0 vulnerabilities');
    await wait(500);

    // 4. Verify
    onPhase('verifying');
    onLog('> openclaw --version');
    await wait(300);
    onLog('OpenClaw CLI v0.12.3');
    onLog('> openclaw gateway status');
    await wait(300);
    onLog('Gateway is currently stopped.');

    onPhase('success');
    onLog('=== Installation Completed Successfully ===');
  } catch (error) {
    onLog(`=== Installation Aborted ===`);
    throw error;
  }
}
