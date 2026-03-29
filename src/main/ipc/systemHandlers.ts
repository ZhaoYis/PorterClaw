import { ipcMain } from 'electron';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export function registerSystemHandlers(): void {
  ipcMain.handle('system:exec', async (_, command: string) => {
    // Basic whitelist to prevent arbitrary command execution via this IPC
    const allowedCommands = ['node -v', 'openclaw -v', 'openclaw --version'];
    
    if (!allowedCommands.includes(command)) {
      throw new Error(`Command not permitted: ${command}`);
    }

    try {
      const { stdout } = await execPromise(command);
      return { success: true, output: stdout.trim() };
    } catch (error) {
      // Return a safe error structure instead of throwing IPC serialization errors
      return { success: false, output: null, error: (error as Error).message };
    }
  });
}
