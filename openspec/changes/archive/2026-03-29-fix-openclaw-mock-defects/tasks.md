## 1. Implementation
- [x] 1.1 In `src/main/ipc/systemHandlers.ts`, expand `allowedCommands` to whitelist `openclaw gateway start`, `stop`, `restart`, `status`, `install`, `uninstall`, and `openclaw doctor --fix`.
- [x] 1.2 In `src/renderer/services/configService.ts`, update `checkOpenClawInstalled` to use `openclaw --version`.
- [x] 1.3 In `configService.ts`, modify `executeGatewayAction` to perform `await window.electron.system.exec(commands[action])`. Structure it to gracefully parse the result output or throw the formatted error.
- [x] 1.4 In `configService.ts`, modify `runDoctor` to execute `await window.electron.system.exec('openclaw doctor --fix')`.
