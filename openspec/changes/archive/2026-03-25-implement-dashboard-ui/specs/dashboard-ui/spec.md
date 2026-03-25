## ADDED Requirements

### Requirement: Dashboard 页面布局
Dashboard 页面 SHALL 实现与 wireframe 一致的布局结构，包含顶部导航栏、主内容区域。

#### Scenario: 页面渲染
- **WHEN** 应用启动并加载 Dashboard 页面
- **THEN** 页面 SHALL 显示顶部导航栏和主内容区域
- **AND** 主内容区域 SHALL 包含状态卡片、快捷操作按钮、资源监控网格

### Requirement: 顶部导航栏
导航栏 SHALL 包含 Logo、菜单项和窗口控制按钮。

#### Scenario: 导航栏显示
- **WHEN** Dashboard 页面加载完成
- **THEN** 导航栏 SHALL 显示 PorterClaw Logo 和文字
- **AND** SHALL 显示 Dashboard、Config、Logs、Migrate、Settings 菜单项
- **AND** Dashboard 菜单项 SHALL 为激活状态
- **AND** SHALL 显示最小化、最大化、关闭窗口按钮

### Requirement: 状态卡片组件
状态卡片 SHALL 显示系统运行状态、版本号和运行时间。

#### Scenario: 状态卡片渲染
- **WHEN** Dashboard 页面加载
- **THEN** SHALL 显示绿色状态指示器（带发光效果）
- **AND** SHALL 显示 "Running" 状态文本
- **AND** SHALL 显示版本号（如 v0.12.3）
- **AND** SHALL 显示运行时间（如 2d 4h 32m）

### Requirement: 快捷操作按钮组
快捷操作区域 SHALL 包含 Stop、Restart、Config 三个按钮。

#### Scenario: 快捷操作按钮显示
- **WHEN** Dashboard 页面加载
- **THEN** SHALL 显示三个操作按钮水平排列
- **AND** Restart 按钮 SHALL 为主色（蓝色）样式
- **AND** Stop 和 Config 按钮 SHALL 为次级样式
- **AND** 每个按钮 SHALL 有对应图标和标签

### Requirement: 资源监控网格
资源监控区域 SHALL 以 2x2 网格显示 Gateway、Node、Memory、Active Skills 四个卡片。

#### Scenario: 资源卡片显示
- **WHEN** Dashboard 页面加载
- **THEN** SHALL 显示四个资源监控卡片
- **AND** Gateway 卡片 SHALL 显示 "Running" 状态
- **AND** Node 卡片 SHALL 显示 "Connected" 状态
- **AND** Memory 卡片 SHALL 显示进度条和使用比例（如 256MB / 1GB）
- **AND** Active Skills 卡片 SHALL 显示大号数字（如 12）

### Requirement: 深色主题样式
Dashboard SHALL 使用深色主题，与 wireframe 颜色规范一致。

#### Scenario: 主题颜色应用
- **WHEN** 查看 Dashboard 页面
- **THEN** 背景色 SHALL 为 #1E1E1E
- **AND** 导航栏和卡片背景 SHALL 为 #252526
- **AND** 主色调 SHALL 使用 #0066FF（蓝色）
- **AND** 成功/运行状态 SHALL 使用 #00C853（绿色）
- **AND** 边框色 SHALL 为 #333
