/**
 * Config Service
 * Checks OpenClaw installation status and provides gateway control
 */

import type { OpenClawInfo, GatewayAction, GatewayServiceStatus, OpenClawConfig, EnvironmentStatus, InstallPhase } from '@common/types/config';
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
        const match = result.output.match(/v?\d+\.\d+\.\d+/);
        if (match) {
          nodeVersion = match[0];
          nodeInstalled = true;
        } else {
          nodeVersion = result.output.trim().split('\n').pop() || result.output;
          nodeInstalled = true;
        }
      }
    } catch (e) {
      console.error('Failed to check Node.js version:', e);
    }

    let openclawVersion = '';
    let openclawInstalled = false;
    try {
      const result = await window.electron.system.exec('openclaw --version');
      if (result.success && result.output) {
        const match = result.output.match(/v?\d+\.\d+\.\d+/);
        openclawVersion = match ? match[0] : result.output.trim();
        openclawInstalled = true;
      }
    } catch (e) {
      console.error('Failed to check OpenClaw version:', e);
    }

    return {
      os: osName,
      components: [
        { name: 'Node.js', installed: nodeInstalled, version: nodeVersion, requiredVersion: '>=18.0.0' },
        { name: 'OpenClaw CLI', installed: openclawInstalled, version: openclawVersion, requiredVersion: 'latest' }
      ]
    };
  }

  // Web mode: check if Gateway is reachable
  const base = getGatewayBase();
  let gatewayInstalled = false;
  let gatewayVersion = '';
  try {
    const response = await fetchWithTimeout(`${base}/api/v1/status`, 2000);
    if (response.ok) {
      const data = await response.json();
      gatewayInstalled = true;
      gatewayVersion = data.version || 'unknown';
    }
  } catch {
    // not reachable
  }

  return {
    os: osName,
    components: [
      { name: 'Node.js', installed: true, version: '(web mode)', requiredVersion: '>=18.0.0' },
      { name: 'OpenClaw CLI', installed: gatewayInstalled, version: gatewayVersion, requiredVersion: 'latest' }
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
        const match = result.output.match(/v?\d+\.\d+\.\d+/);
        const versionStr = match ? match[0] : (result.output.trim().split('\n').pop() || result.output);
        return {
          installed: true,
          version: versionStr,
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
 * Returns a full default config object.
 */
export function getDefaultConfig(): OpenClawConfig {
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
    gateway: { port, host, daemon: false, authToken: '' },
    provider: { type: 'openai', apiKey: '', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4' },
    skills: { directory: '~/.openclaw/skills', autoLoad: true },
    logging: { level: 'info', file: '~/.openclaw/logs/openclaw.log' },
  };
}

/**
 * Load OpenClaw config from file (Electron) or gateway API / defaults (Web).
 */
export async function loadOpenClawConfig(): Promise<OpenClawConfig> {
  const defaults = getDefaultConfig();

  if (isElectronEnvironment()) {
    try {
      const result = await window.electron.system.readConfig();
      if (result.success && result.data) {
        return { ...defaults, ...(result.data as Partial<OpenClawConfig>) };
      }
    } catch (e) {
      console.error('Failed to read config file:', e);
    }
    return defaults;
  }

  // Web mode: try gateway API, fallback to defaults
  const base = getGatewayBase();
  try {
    const response = await fetchWithTimeout(`${base}/api/v1/config`, 2000);
    if (response.ok) {
      const data = await response.json();
      return { ...defaults, ...data };
    }
  } catch { /* fallback */ }

  return defaults;
}

/**
 * Save OpenClaw config to file (Electron) or log (Web).
 */
export async function saveOpenClawConfig(config: OpenClawConfig): Promise<void> {
  if (isElectronEnvironment()) {
    const result = await window.electron.system.writeConfig(config);
    if (!result.success) {
      throw new Error(result.error || 'Failed to write config file');
    }
    return;
  }
  console.log('[Web Mode] Config would be saved:', config);
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
 * Execute real OpenClaw installation.
 * In Electron mode: uses IPC streaming to run `npm install -g @openclaw/cli@latest`.
 * In Web mode: shows manual install instructions.
 */
export async function executeAutoInstall(
  onLog: (line: string) => void,
  onPhase: (phase: InstallPhase) => void,
): Promise<void> {
  if (!isElectronEnvironment()) {
    onPhase('checking_prereqs');
    onLog('[Web Mode] Automatic installation is not available in browser mode.');
    onLog('');
    onLog('Please run the following command in your terminal:');
    onLog('');
    onLog(`  ${getInstallCommand()}`);
    onLog('');
    onLog('Or, if you already have Node.js installed:');
    onLog('');
    onLog('  npm install -g @openclaw/cli@latest');
    onLog('');
    onLog('After installation, refresh this page to detect OpenClaw.');
    onPhase('error');
    const err = new Error('Automatic installation is not available in Web mode.');
    (err as any).solution = `Run the install command manually: ${getInstallCommand()}`;
    throw err;
  }

  // Electron mode: delegate to main process via streaming IPC
  const api = window.electron.system;

  // Wire up streaming listeners before triggering install
  api.onInstallLog((line: string) => onLog(line));
  api.onInstallPhase((phase: string) => onPhase(phase as InstallPhase));

  try {
    const result = await api.installOpenClaw();

    if (!result.success) {
      const err = new Error(result.error || 'Installation failed');
      (err as any).solution = result.solution || 'Please check the logs and try again.';
      throw err;
    }
  } finally {
    api.removeInstallListeners();
  }
}
