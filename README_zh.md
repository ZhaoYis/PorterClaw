# PorterClaw

[English](./README.md) | 中文

> **一个为 OpenClaw 打造的现代化、用户友好的桌面控制台与管理工具**。

PorterClaw 是一个基于 Electron 与 React 构建的完整图形界面工具。它旨在简化 OpenClaw 及其生态系统的部署、配置和监控流程。它将传统的基于终端的繁杂步骤，转化为顺滑的、一键式桌面安装体验。

## ✨ 核心特性

- **一键式自动安装**：无缝检测本地环境级依赖（如 Node.js），提供进度可视化的 OpenClaw 安装引导。
- **环境健康检查**：内置诊断面板，在开始重度安装操作前先验证系统依赖情况。
- **实时日志展示**：能够在控制台中直接查看实时的安装日志和运行日志。
- **优雅的异常处理**：将详尽的故障排除方案直接集成于用户界面中，帮助快速解决问题。
- **出色的 UI/UX**：采用 React、Ant Design 和 Zustand 构建现代化的界面与灵活可预测的状态管理系统。

## 🚀 快速开始

### 环境依赖
- [Node.js](https://nodejs.org/) (v16 或更高版本)
- NPM 或 Yarn

### 安装

1. 克隆项目到本地：
```bash
git clone https://github.com/your-username/PorterClaw.git
cd PorterClaw
```

2. 安装相关依赖：
```bash
npm install
```

### 开发环境

在开发模式下启动应用程序（将同时启动 Vite 开发服务器和 Electron）：

```bash
npm run electron:dev
```

### 生产环境构建

编译 TypeScript 代码，通过 Vite 进行构建并打包可执行文件：

```bash
npm run electron:build
```

打包完成后，您可以在 `release/` 目录下找到安装程序。

## 🛠 技术栈

- **桌面框架**：[Electron](https://www.electronjs.org/)
- **前端框架**：[React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **UI 组件库**：[Ant Design](https://ant.design/)
- **状态管理**：[Zustand](https://github.com/pmndrs/zustand)
- **开发语言**：[TypeScript](https://www.typescriptlang.org/)

## 📄 开源协议
本项目基于 MIT 协议开源。
