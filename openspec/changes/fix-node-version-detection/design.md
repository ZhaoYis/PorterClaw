## Context
The preload script `src/preload/index.ts` is currently excluded from TypeScript transpilation because it is missing from the `include` array in `tsconfig.main.json`. This causes the runtime to use an outdated or missing `dist/preload/index.js`, breaking IPC functions like `window.electron.system.exec`.

## Goals / Non-Goals
**Goals:** 
- Fix the build configuration so the preload script is always compiled together with the main process.

**Non-Goals:** 
- Any changes to the actual IPC logic.

## Decisions
Add `"src/preload/**/*"` to `"include"` in `tsconfig.main.json`.

## Risks / Trade-offs
None.
