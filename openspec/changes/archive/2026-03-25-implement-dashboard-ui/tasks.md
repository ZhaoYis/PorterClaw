## 1. 项目初始化与依赖安装

- [x] 1.1 安装 Ant Design 依赖：`npm install antd @ant-design/icons`
- [x] 1.2 安装 Zustand 状态管理：`npm install zustand`
- [x] 1.3 配置 Ant Design 主题（深色模式）
- [x] 1.4 创建基础目录结构：`src/renderer/components/`, `src/renderer/stores/`, `src/main/ipc/`

## 2. 类型定义与共享接口

- [x] 2.1 创建 `src/common/types/dashboard.ts` - Dashboard 相关类型定义
- [x] 2.2 定义 `SystemStatus` 接口（Gateway、Node 状态）
- [x] 2.3 定义 `ResourceMetrics` 接口（内存、技能数）
- [x] 2.4 定义 IPC 通信接口类型

## 3. Zustand 状态管理 Store

- [x] 3.1 创建 `src/renderer/stores/dashboardStore.ts`
- [x] 3.2 实现 status 状态（Gateway、Node 运行状态）
- [x] 3.3 实现 metrics 状态（版本、运行时间、内存、技能数）
- [x] 3.4 实现 actions（刷新状态、执行操作）

## 4. IPC 通信层（主进程）

- [x] 4.1 创建 `src/main/ipc/dashboardHandlers.ts`
- [x] 4.2 实现 `dashboard:status` 处理程序
- [x] 4.3 实现 `dashboard:metrics` 处理程序
- [x] 4.4 实现 `dashboard:action` 处理程序（stop/restart）
- [x] 4.5 实现 `window:minimize/maximize/close` 处理程序
- [x] 4.6 在 main.ts 中注册所有 IPC 处理器

## 5. IPC 通信层（预加载脚本）

- [x] 5.1 更新 `src/preload/index.ts`
- [x] 5.2 暴露 `window.electron.dashboard` API
- [x] 5.3 暴露 `window.electron.window` API（窗口控制）

## 6. UI 组件开发

- [x] 6.1 创建 `src/renderer/components/Navbar.tsx` - 顶部导航栏
- [x] 6.2 创建 `src/renderer/components/WindowControls.tsx` - 窗口控制按钮
- [x] 6.3 创建 `src/renderer/components/StatusCard.tsx` - 状态卡片
- [x] 6.4 创建 `src/renderer/components/QuickActions.tsx` - 快捷操作按钮组
- [x] 6.5 创建 `src/renderer/components/ResourceGrid.tsx` - 资源监控网格
- [x] 6.6 创建 `src/renderer/components/ResourceCard.tsx` - 单个资源卡片

## 7. Dashboard 主页面

- [x] 7.1 创建 `src/renderer/pages/Dashboard.tsx`
- [x] 7.2 集成所有子组件
- [x] 7.3 实现数据加载逻辑（useEffect + IPC 调用）
- [x] 7.4 实现定时刷新机制
- [x] 7.5 在 App.tsx 中注册 Dashboard 路由

## 8. 样式实现

- [x] 8.1 创建 `src/renderer/styles/dashboard.css` - Dashboard 专用样式
- [x] 8.2 实现深色主题颜色变量
- [x] 8.3 实现状态指示器发光效果
- [x] 8.4 实现进度条渐变效果
- [x] 8.5 实现卡片悬浮效果

## 9. 功能集成与测试

- [x] 9.1 验证 IPC 通信正常工作
- [x] 9.2 验证状态数据正确显示
- [x] 9.3 验证窗口控制按钮功能
- [x] 9.4 验证快捷操作按钮交互
- [x] 9.5 验证实时刷新机制

## 10. 代码审查与优化

- [x] 10.1 TypeScript 类型检查通过
- [x] 10.2 ESLint 检查无错误
- [x] 10.3 组件性能优化（useMemo/useCallback）
- [x] 10.4 错误边界处理
- [x] 10.5 加载状态处理
