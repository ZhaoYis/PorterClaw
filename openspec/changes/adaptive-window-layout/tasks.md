## 1. 移除窗口控制功能

- [x] 1.1 修改 `src/main/index.ts` - 将 `frame: false` 改为 `frame: true`
- [x] 1.2 修改 `src/main/index.ts` - 移除 `titleBarStyle: 'hidden'`
- [x] 1.3 修改 `src/main/index.ts` - 移除窗口尺寸固定值（改为默认尺寸）
- [x] 1.4 修改 `src/main/index.ts` - 添加最小窗口尺寸限制（600x400）
- [x] 1.5 修改 `src/main/ipc/dashboardHandlers.ts` - 移除窗口控制处理程序
- [x] 1.6 修改 `src/preload/index.ts` - 移除 `window` API 暴露
- [x] 1.7 删除 `src/renderer/components/WindowControls.tsx` 组件

## 2. 更新导航栏组件

- [x] 2.1 修改 `src/renderer/components/Navbar.tsx` - 移除 `WindowControls` 导入
- [x] 2.2 修改 `src/renderer/components/Navbar.tsx` - 从 JSX 中移除窗口控制按钮
- [x] 2.3 修改 `src/renderer/components/Navbar.tsx` - 调整布局（菜单居中）
- [x] 2.4 修改 `Navbar` 组件样式 - 移除 `-webkit-app-region: drag`（不再需要）

## 3. 重写响应式 CSS 样式

- [x] 3.1 修改 `dashboard.css` - 移除固定窗口尺寸样式（`.app-window`）
- [x] 3.2 修改 `dashboard.css` - 将 `.app-window` 改为 `width: 100vw; height: 100vh`
- [x] 3.3 修改 `dashboard.css` - 添加媒体查询断点（<600px, 600-900px, >900px）
- [x] 3.4 修改 `dashboard.css` - 资源网格响应式布局（grid-template-columns 媒体查询）
- [x] 3.5 修改 `dashboard.css` - 状态卡片弹性布局（flex-wrap, gap 自适应）
- [x] 3.6 修改 `dashboard.css` - 快捷操作按钮自适应（flex: 1, min-width）
- [x] 3.7 修改 `dashboard.css` - 主内容区域滚动（overflow-y: auto）
- [x] 3.8 修改 `dashboard.css` - 导航栏宽度自适应（移除固定 padding 调整）

## 4. 更新 Dashboard 主页面

- [x] 4.1 修改 `src/renderer/pages/Dashboard.tsx` - 检查并移除窗口控制相关逻辑
- [x] 4.2 修改 `Dashboard` 组件 - 确保响应式布局正常工作
- [x] 4.3 验证 `Dashboard` 在不同尺寸下的渲染

## 5. 更新其他组件

- [x] 5.1 修改 `src/renderer/components/ResourceGrid.tsx` - 确保响应式类名正确
- [x] 5.2 修改 `src/renderer/components/ResourceCard.tsx` - 检查自适应样式
- [x] 5.3 修改 `src/renderer/components/StatusCard.tsx` - 检查弹性布局
- [x] 5.4 修改 `src/renderer/components/QuickActions.tsx` - 检查按钮自适应

## 6. 测试验证

- [x] 6.1 构建项目 `npm run build`
- [x] 6.2 启动应用 `npm run electron:dev`
- [x] 6.3 测试窗口最大化/最小化/关闭（系统原生按钮）
- [x] 6.4 测试窗口缩放（600px 宽度）
- [x] 6.5 测试窗口缩放（900px 宽度）
- [x] 6.6 测试窗口缩放（1200px+ 宽度）
- [x] 6.7 验证所有功能正常（状态显示、快捷操作、资源监控）
- [x] 6.8 检查不同尺寸下的布局无重叠或截断

## 7. 代码审查

- [x] 7.1 TypeScript 类型检查通过 `npx tsc --noEmit`
- [x] 7.2 移除未使用的导入和变量
- [x] 7.3 确认无 console 警告或错误
- [x] 7.4 提交更改到 git
