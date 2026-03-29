## Why

The `node -v` detection feature recently implemented is failing to verify the local Node.js installation. During execution via `npm run electron:dev`, the system silently suppresses the detection error, returning Node.js as "not installed" even though it is present. The root cause is a configuration oversight: `src/preload/index.ts` is not included in `tsconfig.main.json`. Consequently, the modified preload script containing `window.electron.system.exec` is never transpiled into `dist/preload/index.js`, leading to a `TypeError: Cannot read properties of undefined (reading 'exec')` in the renderer process.

## What Changes

- Add `"src/preload/**/*"` to the `"include"` array in `tsconfig.main.json` to ensure the preload script is correctly built alongside the main process.
- (Optional) Enhance the `checkSystemEnvironment` error handling temporarily to explicitly log exceptions instead of silently catching them, to ease debugging if `exec` fails for terminal PATH reasons.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
None.

## Impact

- Affected code: `tsconfig.main.json`
- Impact: Restores the intended functionality of testing exactly `node -v` and `openclaw -v` via the IPC bridge.
