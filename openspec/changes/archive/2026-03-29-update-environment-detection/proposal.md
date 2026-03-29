# Change: Implement Real Environment Checks for Node and OpenClaw

## Why
Currently, the environment assessment feature (which checks for Node.js and OpenClaw presence) relies on hardcoded or mocked values in `configService.ts` when running in Electron mode. The user requires that we actually execute `node -v` and `openclaw -v` via IPC to correctly detect if these critical dependencies are installed locally on the host machine.

## What Changes
- Add an IPC handler (`system:exec`) in the main process to securely run shell commands for version detection.
- Expose this new execution capability through the `contextBridge` in `preload/index.ts`.
- Update the `checkSystemEnvironment` and `checkOpenClawInstalled` functions in `configService.ts` to invoke the real commands instead of resolving dummy values.
- Parse the stdout from these commands to pull exact version numbers or to fail gracefully if the software is absent.

## Impact
- Affected specs: `environment-detection`
- Affected code: `src/main/ipc` (or `main.ts`), `src/preload/index.ts`, `src/renderer/services/configService.ts`
