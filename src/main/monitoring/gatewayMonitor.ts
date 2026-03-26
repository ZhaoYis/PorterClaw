import { exec } from 'child_process';
import { promisify } from 'util';
import * as net from 'net';

const execAsync = promisify(exec);

export type GatewayStatus = 'running' | 'stopped' | 'unknown';

const GATEWAY_PROCESS_NAMES = ['openclaw-gateway', 'porterclaw-gateway', 'gateway'];
const GATEWAY_DEFAULT_PORT = 8080;

/**
 * Check if a process is running by name
 */
async function checkProcessByName(processName: string): Promise<boolean> {
  const platform = process.platform;

  try {
    if (platform === 'win32') {
      const { stdout } = await execAsync(`tasklist /FI "IMAGENAME eq ${processName}*" /NH`);
      return stdout.toLowerCase().includes(processName.toLowerCase());
    } else {
      // macOS and Linux
      const { stdout } = await execAsync(`pgrep -i "${processName}"`);
      return stdout.trim().length > 0;
    }
  } catch {
    return false;
  }
}

/**
 * Check if a port is in use
 */
async function checkPortInUse(port: number, host: string = 'localhost'): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    const onError = () => {
      socket.destroy();
      resolve(false);
    };

    socket.setTimeout(1000);
    socket.once('error', onError);
    socket.once('timeout', onError);

    socket.connect(port, host, () => {
      socket.destroy();
      resolve(true);
    });
  });
}

/**
 * Check Gateway process status
 */
export async function checkGatewayProcess(): Promise<boolean> {
  for (const processName of GATEWAY_PROCESS_NAMES) {
    const isRunning = await checkProcessByName(processName);
    if (isRunning) {
      return true;
    }
  }
  return false;
}

/**
 * Check Gateway port status
 */
export async function checkGatewayPort(port: number = GATEWAY_DEFAULT_PORT): Promise<boolean> {
  return checkPortInUse(port);
}

/**
 * Get Gateway status (unified interface)
 * Checks both process and port, returns running if either is true
 */
export async function getGatewayStatus(): Promise<GatewayStatus> {
  try {
    // Check process first
    const processRunning = await checkGatewayProcess();
    if (processRunning) {
      return 'running';
    }

    // Check port as fallback
    const portInUse = await checkGatewayPort();
    if (portInUse) {
      return 'running';
    }

    return 'stopped';
  } catch (error) {
    console.error('Error checking Gateway status:', error);
    return 'unknown';
  }
}
