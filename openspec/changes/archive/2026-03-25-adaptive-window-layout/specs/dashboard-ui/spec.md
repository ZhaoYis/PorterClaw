## MODIFIED Requirements

### Requirement: Dashboard 页面布局
Dashboard 页面 SHALL 实现响应式布局结构，根据窗口尺寸自动调整，包含顶部导航栏、主内容区域。

#### Scenario: 页面渲染（小窗口）
- **WHEN** 应用启动并加载 Dashboard 页面
- **AND** 窗口宽度小于 600px
- **THEN** 页面 SHALL 显示单列布局
- **AND** 资源监控网格 SHALL 显示为单列

#### Scenario: 页面渲染（中窗口）
- **WHEN** 应用启动并加载 Dashboard 页面
- **AND** 窗口宽度在 600px 到 900px 之间
- **THEN** 页面 SHALL 显示适配的布局
- **AND** 资源监控网格 SHALL 显示为双列

#### Scenario: 页面渲染（大窗口）
- **WHEN** 应用启动并加载 Dashboard 页面
- **AND** 窗口宽度大于 900px
- **THEN** 页面 SHALL 显示宽松的布局
- **AND** 内容区域 SHALL 自动扩展

### Requirement: 顶部导航栏
导航栏 SHALL 包含 Logo 和菜单项，不再包含窗口控制按钮。

#### Scenario: 导航栏显示
- **WHEN** Dashboard 页面加载完成
- **THEN** 导航栏 SHALL 显示 PorterClaw Logo 和文字
- **AND** SHALL 显示 Dashboard、Config、Logs、Migrate、Settings 菜单项
- **AND** Dashboard 菜单项 SHALL 为激活状态
- **AND** SHALL **不显示**窗口控制按钮

### Requirement: 状态卡片组件
状态卡片 SHALL 使用弹性布局，适应不同窗口宽度。

#### Scenario: 状态卡片渲染（响应式）
- **WHEN** Dashboard 页面加载
- **AND** 窗口尺寸变化
- **THEN** 状态卡片 SHALL 自动调整内部元素间距
- **AND** SHALL 保持内容居中对齐

## REMOVED Requirements

### Requirement: 窗口控制按钮区域
**Reason**: 使用系统原生窗口标题栏，不再需要自定义窗口控制按钮
**Migration**: 窗口控制由操作系统处理，应用内无需实现

### Requirement: 固定窗口尺寸
**Reason**: 改为响应式布局，支持用户自由调整窗口大小
**Migration**: 设置最小窗口尺寸为 600x400px，不再限制固定尺寸
