import { ipcMain } from 'electron';
import { exec } from 'child_process';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);

export function registerSystemHandlers(): void {
  ipcMain.handle('system:exec', async (_, command: string) => {
    // Basic whitelist to prevent arbitrary command execution via this IPC
    const allowedCommands = ['node -v', 'openclaw -v', 'openclaw --version'];

    if (!allowedCommands.includes(command)) {
      throw new Error(`Command not permitted: ${command}`);
    }

    try {
      let execCommand = command;

      // On macOS and Linux, GUI apps don't inherit the user's shell PATH.
      // Run the command via the user's default shell as a login shell
      // so it sources ~/.bashrc or ~/.zshrc which sets up nvm/Node/openclaw PATHs.
      if (os.platform() === 'darwin' || os.platform() === 'linux') {
        const shell = process.env.SHELL || '/bin/bash';
        execCommand = `${shell} -lc "${command}"`;
      }

      const { stdout } = await execPromise(execCommand);
      return { success: true, output: stdout.trim() };
    } catch (error) {
      // Return a safe error structure instead of throwing IPC serialization errors
      return { success: false, output: null, error: (error as Error).message };
    }
  });
}
