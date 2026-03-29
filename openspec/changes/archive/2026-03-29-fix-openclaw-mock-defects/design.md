## Context

The gateway commands (`start`, `stop`, `restart`, `status`, `install`, `uninstall`) and the `doctor --fix` command are exposed on the UI but are dead-ends. They do not trigger IPC events to the `system:exec` handler in the main electron process.

## Goals / Non-Goals

**Goals:**
- Guarantee UI actions directly correspond to actual executed commands.

## Decisions

1. Extend `systemHandlers.ts` `allowedCommands` to include all specific gateway maintenance commands.
2. In `configService.ts`, rewrite `executeGatewayAction(action)`:
   - Run `const result = await window.electron.system.exec(commands[action])`.
   - If `!result.success`, throw a descriptive Error so the UI displays the failure (or format the error block as a string log if the UI expects safe strings). The method returns `Promise<string>`, so we can just return `result.output || result.error` or throw. The error banner UI usually catches `Promise.reject()`, or logs it.
3. In `configService.ts`, rewrite `runDoctor()` symmetrically.
4. Correct the `-v` flag to `--version` in `checkOpenClawInstalled()`.

## Risks / Trade-offs

- Running background commands securely. The static whitelist mitigates the risk.
- Process stalls (`exec` has no timeout currently). If the gateway command hangs, the UI might keep spinning.
