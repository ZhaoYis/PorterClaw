## Context

PorterClaw 是一个 Electron + React 桌面应用，需要实现一个现代化的 Dashboard UI。根据 wireframe 设计，Dashboard 需要展示系统状态、提供快捷操作和资源监控。这是一个纯前端 UI 实现，需要与主进程通信获取实时数据。

当前项目已配置 Electron + React + TypeScript 基础架构，需要补充完整的 Dashboard 页面组件和状态管理。

## Goals / Non-Goals

**Goals:**
- 实现与 wireframe 完全一致的 Dashboard UI
- 使用 Ant Design 组件库构建界面
- 使用 Zustand 管理应用状态
- 建立主进程与渲染进程的 IPC 通信
- 实现响应式的状态展示和交互

**Non-Goals:**
- 后端业务逻辑实现（Gateway/Node 实际控制）
- 数据库操作
- 多页面路由（专注 Dashboard 单页）
- 主题切换功能

## Decisions

### 1. 组件架构
- **决策**: 采用容器组件 + 展示组件模式
- **理由**: Dashboard 作为容器组件管理状态，子组件专注展示
- **替代方案**: 单一组件（ rejected - 难以维护）

### 2. 状态管理
- **决策**: 使用 Zustand 替代 React Context
- **理由**: 更轻量、TypeScript 支持好、无需 Provider 包裹
- **存储结构**: 单 store 设计，包含 status、metrics、actions

### 3. UI 组件库
- **决策**: Ant Design 作为基础 + 自定义样式覆盖
- **理由**: 组件丰富、文档完善、支持深色主题
- **样式方案**: CSS Modules + 全局主题变量

### 4. IPC 通信
- **决策**: 使用 Electron 的 contextBridge + ipcRenderer
- **理由**: 安全隔离主进程和渲染进程
- **频道设计**: `dashboard:status`, `dashboard:metrics`, `dashboard:action`

### 5. 图标方案
- **决策**: @ant-design/icons + 自定义 SVG
- **理由**: 与 Ant Design 风格一致

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 深色主题定制复杂 | 使用 ConfigProvider 全局配置，少量 CSS 覆盖 |
| IPC 通信延迟 | 使用防抖节流，添加加载状态 |
| 窗口控制跨平台差异 | 使用 Electron 原生 API，条件处理 macOS/Win/Linux |
| Ant Design 体积较大 | 使用 babel-plugin-import 按需加载 |

## Migration Plan

1. **Phase 1**: 创建基础组件和布局
2. **Phase 2**: 实现 IPC 通信和状态管理
3. **Phase 3**: 集成测试和样式微调

回滚策略: 删除新增文件即可，不影响现有功能。

## Open Questions

- 是否需要支持自定义窗口尺寸？
- 实时数据刷新频率如何设置？
