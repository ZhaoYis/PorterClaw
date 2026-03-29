# PorterClaw

[中文](./README_zh.md) | English

> **A user-friendly desktop dashboard and management tool for OpenClaw**.

PorterClaw is a complete graphical interface built on Electron and React, designed to simplify the deployment, configuration, and monitoring of OpenClaw and its ecosystem. It transforms the manual, terminal-based setup of OpenClaw into a seamless, one-click desktop experience.

## ✨ Features

- **One-Click Automated Installation**: Seamlessly detects local environment requirements (like Node.js) and guides you through a progress-aware installation of OpenClaw.
- **Environment Checking**: Built-in diagnostics panel to verify dependencies before proceeding with heavy installations.
- **Real-Time Logging**: View live installation and runtime logs directly inside the dashboard.
- **Graceful Error Handling**: Actionable troubleshooting solutions integrated right into the UI.
- **Beautiful UI/UX**: Built with React, Ant Design, and Zustand for a snappy and predictable state management system in a modern interface.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- NPM or Yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/PorterClaw.git
cd PorterClaw
```

2. Install dependencies:
```bash
npm install
```

### Development

To start the application in development mode (starts Vite dev server and then Electron):

```bash
npm run electron:dev
```

### Building for Production

Compile TypeScript, build with Vite, and package as an executable format:

```bash
npm run electron:build
```

You can find the packaged release in the `release/` directory.

## 🛠 Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/)
- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **UI Components**: [Ant Design](https://ant.design/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📄 License
This project is licensed under the MIT License.
