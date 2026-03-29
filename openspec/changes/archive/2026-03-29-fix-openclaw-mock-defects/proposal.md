## Why

The goal of the previous implementation was to introduce real system level detection `system.exec` using IPC, replacing the pseudo/mock web simulation. However, a full project scan reveals several critical mocked placeholders in `configService.ts` that were never connected to the IPC bridge. Additionally, OpenClaw CLI utilizes `openclaw --version` standard for versioning checks, rendering the `-v` execution command unapplicable and leading to incorrect "Not Installed" results. 

Specifically, the following actions mock executions in Electron Mode rather than triggering actual real-time operations:
- `openclaw -v` command failure in `checkOpenClawInstalled`.
- `executeGatewayAction()` strings returning 'Executing: ...' instead of spawning processes.
- `runDoctor()` strings returning 'Running openclaw doctor --fix...' instead of spawning processes.

## What Changes

- Modify `checkOpenClawInstalled` to correctly execute `openclaw --version` matching the official CLI argument schema.
- Implement true asynchronous dispatching to `window.electron.system.exec` in `executeGatewayAction(action)`, capturing and relaying `stdout` & `stderr`.
- Implement true asynchronous dispatching in `runDoctor()`.
- Whitelist the newly required Gateway Service and Doctor operations in the IPC security handler (`systemHandlers.ts`).

## Capabilities

### New Capabilities
None.

### Modified Capabilities
None. The behavior meets original mock interface expectations, simply transitioning entirely to live runtime.

## Impact
- **Impacted Elements:** Config UI reliability, Gateway Control Panel functionality, and Error Repair Doctor functionality.
- Once completed, the app transforms from a mocked presentation layer to an actively integrated daemon control interface.
