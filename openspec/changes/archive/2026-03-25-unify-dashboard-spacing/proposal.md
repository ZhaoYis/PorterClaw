## Why

当前 Dashboard 页面各组件之间的间距不统一，影响视觉一致性和美观性。状态卡片、快捷操作按钮、资源监控网格之间的垂直间距需要统一，以提升整体 UI 质感。

## What Changes

- 统一 `.main-content` 容器的 `gap` 值为一致的间距
- 确保状态卡片、快捷操作、资源网格之间使用相同的垂直间距
- 调整 CSS 变量或固定值，实现视觉一致性

## Capabilities

### New Capabilities
- 无（纯样式调整，不涉及新功能）

### Modified Capabilities
- `dashboard-ui`: 统一组件间距样式

## Impact

- **修改文件**:
  - `src/renderer/styles/dashboard.css` - 调整 `.main-content` 的 gap 值

- **UI 变化**:
  - 状态卡片与快捷操作按钮间距统一
  - 快捷操作按钮与资源监控网格间距统一
  - 整体视觉更加协调
