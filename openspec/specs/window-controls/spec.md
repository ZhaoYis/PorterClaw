## Requirements

### Requirement: 窗口最小化
系统 SHALL 提供窗口最小化功能。

#### Scenario: 点击最小化按钮
- **WHEN** 用户点击最小化按钮（黄色按钮）
- **THEN** 应用窗口 SHALL 最小化到任务栏

### Requirement: 窗口最大化/还原
系统 SHALL 提供窗口最大化和还原功能。

#### Scenario: 点击最大化按钮
- **WHEN** 用户点击最大化按钮（绿色按钮）
- **AND** 窗口当前未最大化
- **THEN** 窗口 SHALL 最大化
- **AND** 按钮图标 SHALL 变为还原图标

#### Scenario: 点击还原按钮
- **WHEN** 用户点击还原按钮
- **AND** 窗口当前已最大化
- **THEN** 窗口 SHALL 还原到原始大小
- **AND** 按钮图标 SHALL 变为最大化图标

### Requirement: 窗口关闭
系统 SHALL 提供窗口关闭功能。

#### Scenario: 点击关闭按钮
- **WHEN** 用户点击关闭按钮（红色按钮）
- **THEN** 应用窗口 SHALL 关闭
- **AND** 应用进程 SHALL 根据配置决定退出或后台运行

### Requirement: 窗口控制按钮样式
窗口控制按钮 SHALL 使用 macOS 风格的三色圆点设计。

#### Scenario: 按钮样式
- **WHEN** 查看导航栏右上角
- **THEN** SHALL 显示三个圆形按钮
- **AND** 关闭按钮 SHALL 为红色 (#ff5f56)
- **AND** 最小化按钮 SHALL 为黄色 (#ffbd2e)
- **AND** 最大化按钮 SHALL 为绿色 (#27c93f)

### Requirement: 窗口控制 IPC 通信
窗口控制 SHALL 通过 IPC 与主进程通信。

#### Scenario: IPC 调用
- **WHEN** 用户点击窗口控制按钮
- **THEN** SHALL 通过 `window:minimize`、`window:maximize`、`window:close` IPC 频道发送消息
- **AND** 主进程 SHALL 执行相应窗口操作
