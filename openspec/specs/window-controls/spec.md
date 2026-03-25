## Requirements

### Requirement: 系统原生窗口标题栏
系统 SHALL 使用操作系统原生窗口标题栏替代无边框窗口。

#### Scenario: 窗口显示
- **WHEN** 应用启动
- **THEN** 窗口 SHALL 显示操作系统原生的标题栏
- **AND** SHALL 包含系统原生的窗口控制按钮（最小化、最大化、关闭）
- **AND** 标题栏 SHALL 显示应用名称 "PorterClaw"

### Requirement: 窗口最小尺寸
系统 SHALL 设置窗口最小尺寸，保证布局可用性。

#### Scenario: 调整窗口大小
- **WHEN** 用户尝试调整窗口大小
- **THEN** 窗口宽度 SHALL 不小于 600px
- **AND** 窗口高度 SHALL 不小于 400px
