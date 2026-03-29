## 1. Implementation
- [x] 1.1 Add `system:exec` IPC handler in the main process (e.g., `src/main/ipc/systemManager.ts` or `src/main/index.ts`) using Node's `child_process.exec`.
- [x] 1.2 Expose an `exec` method via the `contextBridge` in `src/preload/index.ts`.
- [x] 1.3 Update `checkSystemEnvironment()` in `src/renderer/services/configService.ts` to call the newly-exposed exec method to check `node -v`.
- [x] 1.4 Update `checkOpenClawInstalled()` in `src/renderer/services/configService.ts` to call the exposed exec method to check `openclaw -v`.
- [x] 1.5 Process the output/errors from `exec` natively to safely fail and mark utilities as missing when they are not found.
