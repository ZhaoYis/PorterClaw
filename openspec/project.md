# Project Context

## Purpose
PorterClaw is a user-friendly desktop dashboard and management tool for OpenClaw. It provides a complete graphical interface designed to simplify the deployment, configuration, and monitoring of OpenClaw and its ecosystem, transforming manual terminal-based setups into a seamless, one-click experience.

## Tech Stack
- **Frontend Core**: React (v18)
- **Desktop Framework**: Electron
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Zustand
- **UI Components**: Ant Design

## Project Conventions

### Code Style
- Strict TypeScript constraints (e.g., `noUnusedLocals` is enabled).
- React Functional Components utilizing React Hooks.
- Standard ESLint configuration for code formatting and linting.

### Architecture Patterns
- **IPC Communication**: Electron IPC is used for communication between the Main and Renderer processes.
- **State Store**: Zustand is utilized for lightweight, hook-based global state management.
- **Internationalization**: i18n is built-in (supporting English and Chinese).

### Testing Strategy
- Manual testing focused on Electron workflows and user interaction.
- (Add automated testing specifics like Vitest or Playwright if adopted in the future).

### Git Workflow
- Standard feature-branch workflow.
- Commit messages should be descriptive and reference the corresponding OpenSpec `change-id` when applicable.

## Domain Context
- **OpenClaw**: The underlying core system being installed, configured, and managed by PorterClaw.
- **Environment Assessment**: The dashboard acts as a prerequisite checker, detecting host environment requirements (like Node.js, NPM/Yarn) before installation.

## Important Constraints
- **Performance**: The UI must remain responsive and provide real-time feedback (logs, progress) during heavy asynchronous background tasks (e.g., downloading/installing OpenClaw).
- **Cross-platform**: Built natively with Electron, packaging targets include macOS (`dmg`/`app`) and Windows (`nsis`).
- **File System Interaction**: Strong reliance on safe, localized read/writes for configuration states (`configService` etc.).

## External Dependencies
- **OpenClaw Engine**: The target software lifecycle being managed.
- **Host System Node.js**: Required locally for running installation scripts and the OpenClaw environment.
