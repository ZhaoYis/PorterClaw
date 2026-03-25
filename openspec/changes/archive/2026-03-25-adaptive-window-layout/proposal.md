## Why

当前 Dashboard UI 采用固定尺寸 (900x600px) 设计，且右上角显示 macOS 风格的窗口控制按钮。这限制了用户调整窗口大小的灵活性，且在某些平台上（如 Windows/Linux）窗口控制按钮可能重复显示（系统自带 + 自定义）。移除自定义窗口控制按钮并改为响应式布局，可以提升跨平台一致性，并允许用户自由调整窗口尺寸。

## What Changes

- **移除** `WindowControls` 组件中的三个自定义按钮（关闭/最小化/最大化）
- **修改** 导航栏 `Navbar` 组件，移除窗口控制按钮区域
- **修改** `dashboard.css` 样式，将固定尺寸改为响应式尺寸
- **修改** `src/main/index.ts`，使用默认窗口框架（`frame: true`）替代无边框窗口
- **修改** 所有组件布局，使用 flex/grid 自适应布局替代固定像素值
- **修改** 资源监控网格，支持不同窗口尺寸下的重新排列
- **修改** 状态卡片和快捷操作按钮，支持自适应缩放

## Capabilities

### New Capabilities
- `responsive-layout`: 响应式布局系统，支持窗口尺寸变化自动适配
- `css-media-queries`: 使用 CSS media queries 实现断点布局

### Modified Capabilities
- `dashboard-ui`: 移除窗口控制按钮，改为响应式布局
- `window-controls`: **BREAKING** 移除自定义窗口控制按钮，使用系统原生控制

## Impact

- **修改文件**:
  - `src/renderer/components/WindowControls.tsx` - 移除或简化
  - `src/renderer/components/Navbar.tsx` - 移除窗口控制按钮引用
  - `src/renderer/styles/dashboard.css` - 改为响应式样式
  - `src/main/index.ts` - 修改窗口配置
  - `src/renderer/components/ResourceGrid.tsx` - 改为响应式网格
  - `src/renderer/components/ResourceCard.tsx` - 改为自适应尺寸
  - `src/renderer/components/StatusCard.tsx` - 改为弹性布局
  - `src/renderer/components/QuickActions.tsx` - 改为自适应按钮
  - `src/renderer/pages/Dashboard.tsx` - 移除相关窗口控制逻辑
  - `src/preload/index.ts` - 移除窗口控制 API
  - `src/main/ipc/dashboardHandlers.ts` - 移除窗口控制处理程序

- **UI 变化**:
  - 窗口尺寸不再固定为 900x600px
  - 最小窗口尺寸保持 600x400px
  - 使用系统原生窗口标题栏
  - 布局根据窗口宽度自动调整（单列/双列/多列）

- **依赖变化**: 无
