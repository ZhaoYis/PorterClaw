# Fix OpenClaw Version Detection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure that the OpenClaw and Node.js version detection works reliably in the Electron app by running commands in a login shell, allowing GUI apps to inherit the user's full `$PATH` configuration on macOS and Linux.

**Architecture:** Electron GUI applications on macOS and Linux typically only receive a minimal system `$PATH` (`/usr/bin:/bin:/usr/sbin:/sbin`), skipping user-level tool paths installed via `nvm`, `brew` or `bun` etc. To fix this, we will execute our whitelisted IPC shell commands via the user's default shell using the `-lc` (login shell) flags, forcing the shell to parse configuration files like `.zshrc` and `.bashrc` first, retrieving the correct user `$PATH`.

**Tech Stack:** Node.js `child_process`, Electron IPC, macOS/Linux bash/zsh.

---

### Task 1: Execute whitelisted commands in login shell for Mac/Linux

**Files:**
- Modify: `src/main/ipc/systemHandlers.ts`

- [ ] **Step 1: Update `systemHandlers.ts` to use a login shell for `darwin` and `linux`**

Modify `src/main/ipc/systemHandlers.ts` to wrap the `command` correctly based on the platform.

```typescript
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
```

- [ ] **Step 2: Compile the updated main process**

Run: `npm run build:main`
Expected: Completion without TypeScript errors.

- [ ] **Step 3: Commit the changes**

```bash
git add src/main/ipc/systemHandlers.ts
git commit -m "fix: run system version checks in login shell to inherit user PATH on macOS/Linux"
```
