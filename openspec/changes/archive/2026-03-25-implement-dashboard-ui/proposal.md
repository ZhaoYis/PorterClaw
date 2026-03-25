## Why

PorterClaw 需要一个新的 Dashboard UI 来提供直观的系统状态监控和管理界面。当前的实现缺少可视化的状态展示和操作入口，用户无法快速了解 Gateway、Node 运行状态以及资源使用情况。根据设计好的 wireframe，我们需要将其完整实现为可交互的 React 组件。

## What Changes

- 创建 Dashboard 主页面组件，包含完整的布局结构
- 实现顶部导航栏（Logo、菜单、窗口控制按钮）
- 实现状态卡片组件（运行状态、版本、运行时间）
- 实现快捷操作按钮组（Stop、Restart、Config）
- 实现资源监控网格（Gateway、Node、Memory、Active Skills）
- 集成 Zustand 状态管理存储应用状态
- 使用 Ant Design 组件库构建 UI
- 添加主进程与渲染进程通信接口获取实时数据

## Capabilities

### New Capabilities
- `dashboard-ui`: Dashboard 页面 UI 组件实现，包含布局、样式和基础交互
- `status-monitor`: 系统状态监控功能，包括 Gateway、Node 状态检测
- `resource-metrics`: 资源指标采集与展示（内存使用、活跃技能数）
- `window-controls`: 自定义窗口控制（最小化、最大化、关闭）
- `quick-actions`: 快捷操作功能（停止、重启、配置）

### Modified Capabilities
- 无

## Impact

- **新增文件**:
  - `src/renderer/pages/Dashboard.tsx` - Dashboard 主页面
  - `src/renderer/components/` - 可复用 UI 组件
  - `src/renderer/stores/` - Zustand 状态存储
  - `src/main/ipc/` - IPC 通信处理
  - `src/common/types/` - 共享类型定义

- **依赖项**:
  - Ant Design (antd)
  - Zustand
  - @ant-design/icons

- **UI 规范**:
  - 深色主题 (#1E1E1E 背景)
  - 主色调: #0066FF (蓝色), #00C853 (绿色)
  - 窗口尺寸: 900x600px
