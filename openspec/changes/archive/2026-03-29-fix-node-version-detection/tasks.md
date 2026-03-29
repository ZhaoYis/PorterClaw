## 1. Implementation
- [x] 1.1 Add `"src/preload/**/*"` to the `"include"` section of `tsconfig.main.json`.
- [x] 1.2 Temporarily remove or adjust the empty `catch (e)` blocks in `configService.ts` to `console.error` the error so it won't be silently hidden in the future.
