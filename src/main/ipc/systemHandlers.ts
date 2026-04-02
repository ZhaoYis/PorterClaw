import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
import os from 'os';
import { logger } from '../logger';

const execPromise = util.promisify(exec);

function getLoginShell(): string {
  return process.env.SHELL || '/bin/bash';
}

function wrapInLoginShell(command: string): { cmd: string; args: string[] } {
  if (os.platform() === 'win32') {
    return { cmd: 'cmd.exe', args: ['/c', command] };
  }
  const shell = getLoginShell();
  return { cmd: shell, args: ['-lc', command] };
}

/**
 * Run a command and stream stdout/stderr line-by-line to the renderer.
 * Resolves with the full stdout on success, rejects on non-zero exit.
 */
function spawnStreaming(
  command: string,
  sender: IpcMainInvokeEvent['sender'],
): Promise<string> {
  return new Promise((resolve, reject) => {
    const { cmd, args } = wrapInLoginShell(command);
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    const sendLine = (line: string) => {
      if (!sender.isDestroyed()) {
        sender.send('install:log', line);
      }
    };

    let stdoutBuffer = '';
    child.stdout.on('data', (chunk: Buffer) => {
      stdoutBuffer += chunk.toString();
      const lines = stdoutBuffer.split('\n');
      stdoutBuffer = lines.pop() || '';
      for (const line of lines) {
        stdout += line + '\n';
        sendLine(line);
      }
    });

    let stderrBuffer = '';
    child.stderr.on('data', (chunk: Buffer) => {
      stderrBuffer += chunk.toString();
      const lines = stderrBuffer.split('\n');
      stderrBuffer = lines.pop() || '';
      for (const line of lines) {
        stderr += line + '\n';
        sendLine(line);
      }
    });

    child.on('close', (code) => {
      if (stdoutBuffer) { stdout += stdoutBuffer; sendLine(stdoutBuffer); }
      if (stderrBuffer) { stderr += stderrBuffer; sendLine(stderrBuffer); }

      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr.trim() || `Command exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

export function registerSystemHandlers(): void {
  ipcMain.handle('system:exec', async (_, command: string) => {
    const allowedCommands = [
      'node -v',
      'npm -v',
      'openclaw -v',
      'openclaw --version',
      'openclaw gateway start',
      'openclaw gateway stop',
      'openclaw gateway restart',
      'openclaw gateway status',
      'openclaw gateway install',
      'openclaw gateway uninstall',
      'openclaw doctor --fix',
      'openclaw init'
    ];

    if (!allowedCommands.includes(command)) {
      logger.warn(`Command not permitted: ${command}`, 'system');
      throw new Error(`Command not permitted: ${command}`);
    }

    logger.debug(`Executing command: ${command}`, 'system');
    try {
      try {
        const { stdout } = await execPromise(command);
        logger.info(`Command succeeded: ${command}`, 'system');
        return { success: true, output: stdout.trim() };
      } catch (directError: any) {
        if (os.platform() === 'darwin' || os.platform() === 'linux') {
          const shell = getLoginShell();
          const { stdout } = await execPromise(`${shell} -lc "${command}"`);
          logger.info(`Command succeeded (via login shell): ${command}`, 'system');
          return { success: true, output: stdout.trim() };
        }
        throw directError;
      }
    } catch (error) {
      logger.error(`Command failed: ${command} — ${(error as Error).message}`, 'system');
      return { success: false, output: null, error: (error as Error).message };
    }
  });

  ipcMain.handle('system:install-openclaw', async (event) => {
    const sender = event.sender;
    const sendPhase = (phase: string) => {
      if (!sender.isDestroyed()) sender.send('install:phase', phase);
    };
    const sendLog = (line: string) => {
      if (!sender.isDestroyed()) sender.send('install:log', line);
    };

    logger.info('OpenClaw installation started', 'installer');
    try {
      // Phase 1: Check prerequisites
      sendPhase('checking_prereqs');
      sendLog('> Checking system architecture...');
      sendLog(`System: ${os.type()} / ${os.arch()}`);
      sendLog('> Checking Node.js requirement...');

      let nodeAvailable = false;
      try {
        const nodeVersion = await spawnStreaming('node -v', sender);
        sendLog(`Node.js found: ${nodeVersion}`);
        nodeAvailable = true;
      } catch {
        sendLog('Node.js not found in PATH.');
      }

      if (!nodeAvailable) {
        sendLog('> Checking npm availability...');
        try {
          await spawnStreaming('npm -v', sender);
        } catch {
          sendPhase('error');
          sendLog('ERROR: Node.js and npm are not available.');
          sendLog('=== Installation Aborted ===');
          return {
            success: false,
            error: 'Node.js is not installed or not in PATH.',
            solution: 'Please install Node.js (>=18) from https://nodejs.org/ and restart PorterClaw.',
          };
        }
      }

      // Phase 2: Install OpenClaw via npm
      sendPhase('installing_openclaw');
      sendLog('> npm install -g @openclaw/cli@latest');

      try {
        await spawnStreaming('npm install -g @openclaw/cli@latest', sender);
      } catch (npmErr: any) {
        sendPhase('error');
        sendLog(`ERROR: npm install failed — ${npmErr.message}`);
        sendLog('=== Installation Aborted ===');
        return {
          success: false,
          error: npmErr.message || 'npm install -g @openclaw/cli@latest failed',
          solution:
            'Try running `npm install -g @openclaw/cli@latest` manually in your terminal. ' +
            'If you see permission errors, use `sudo npm install -g @openclaw/cli@latest` (macOS/Linux) ' +
            'or run your terminal as Administrator (Windows).',
        };
      }

      // Phase 3: Verify installation
      sendPhase('verifying');
      sendLog('> openclaw --version');

      try {
        const version = await spawnStreaming('openclaw --version', sender);
        sendLog(`OpenClaw CLI ${version}`);
      } catch {
        sendPhase('error');
        sendLog('ERROR: openclaw command not found after installation.');
        sendLog('=== Installation Aborted ===');
        return {
          success: false,
          error: 'OpenClaw was installed but the `openclaw` command is not reachable.',
          solution:
            'The npm global bin directory may not be in your PATH. ' +
            'Run `npm bin -g` to find it and add it to your shell profile, then restart PorterClaw.',
        };
      }

      sendLog('> openclaw gateway status');
      try {
        await spawnStreaming('openclaw gateway status', sender);
      } catch {
        sendLog('Gateway is currently stopped.');
      }

      sendPhase('success');
      sendLog('=== Installation Completed Successfully ===');
      logger.info('OpenClaw installation completed successfully', 'installer');
      return { success: true };
    } catch (err: any) {
      sendPhase('error');
      sendLog(`ERROR: ${err.message}`);
      sendLog('=== Installation Aborted ===');
      logger.error(`OpenClaw installation failed: ${err.message}`, 'installer');
      return {
        success: false,
        error: err.message || 'Unknown installation error',
        solution: 'Please check the logs and manually attempt installation via terminal.',
      };
    }
  });

  const configFilePath = path.join(os.homedir(), '.openclaw', 'openclaw.json');

  ipcMain.handle('system:read-config', async () => {
    try {
      if (!fs.existsSync(configFilePath)) {
        return { success: true, data: null };
      }
      const raw = fs.readFileSync(configFilePath, 'utf-8');
      const data = JSON.parse(raw);
      return { success: true, data };
    } catch (error) {
      return { success: false, data: null, error: (error as Error).message };
    }
  });

  ipcMain.handle('system:write-config', async (_, config: object) => {
    try {
      const dir = path.dirname(configFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}
