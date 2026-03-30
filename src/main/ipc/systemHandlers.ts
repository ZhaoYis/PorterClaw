import { ipcMain } from 'electron';
import { exec } from 'child_process';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);

export function registerSystemHandlers(): void {
  ipcMain.handle('system:exec', async (_, command: string) => {
    // Basic whitelist to prevent arbitrary command execution via this IPC
    const allowedCommands = [
      'node -v',
      'openclaw -v',
      'openclaw --version',
      'openclaw gateway start',
      'openclaw gateway stop',
      'openclaw gateway restart',
      'openclaw gateway status',
      'openclaw gateway install',
      'openclaw gateway uninstall',
      'openclaw doctor --fix'
    ];

    if (!allowedCommands.includes(command)) {
      throw new Error(`Command not permitted: ${command}`);
    }

    try {
      // First try to execute directly (inherits PATH if launched from terminal)
      try {
        const { stdout } = await execPromise(command);
        return { success: true, output: stdout.trim() };
      } catch (directError: any) {
        // If the command failed because it couldn't be found, fallback to login shell.
        // On macOS and Linux, GUI apps don't inherit the user's shell PATH.
        // Run the command via the user's default shell as a login shell
        // so it sources ~/.bashrc or ~/.zshrc which sets up nvm/Node/openclaw PATHs.
        if (os.platform() === 'darwin' || os.platform() === 'linux') {
          const shell = process.env.SHELL || '/bin/bash';
          const execCommand = `${shell} -lc "${command}"`;
          const { stdout } = await execPromise(execCommand);
          return { success: true, output: stdout.trim() };
        }

        throw directError; // Re-throw if it's Windows or another error
      }
    } catch (error) {
      // Return a safe error structure instead of throwing IPC serialization errors
      return { success: false, output: null, error: (error as Error).message };
    }
  });
}
