## Context

当前 Dashboard 页面的 `.main-content` 容器使用 `gap: 16px`，但各组件内部的间距可能不一致。需要检查并统一所有组件间的垂直间距。

## Goals / Non-Goals

**Goals:**
- 统一 Dashboard 主内容区域的组件间距
- 保持视觉一致性

**Non-Goals:**
- 修改组件内部布局
- 调整导航栏或边距

## Decisions

### 1. 统一间距值
- **决策**: 使用 `gap: 24px` 作为主要垂直间距
- **理由**: 24px 是 8px 网格系统的 3 倍，符合设计规范，视觉上更舒适
- **替代方案**: 16px 或 20px（rejected - 间距较小，视觉不够舒展）

### 2. 实现方式
- **决策**: 直接修改 CSS 中的 gap 值
- **理由**: 最简单直接，无需修改组件代码

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 小窗口下间距过大 | 使用媒体查询在小屏幕上减小间距 |

## Migration Plan

1. 修改 `dashboard.css` 中的 `.main-content` gap 值
2. 测试不同窗口尺寸下的效果

回滚策略: 恢复原始 gap 值。
