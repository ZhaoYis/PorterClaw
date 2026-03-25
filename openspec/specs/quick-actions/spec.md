## Requirements

### Requirement: 停止服务操作
系统 SHALL 提供停止 Gateway 服务的快捷操作。

#### Scenario: 点击 Stop 按钮
- **WHEN** 用户点击 Stop 按钮
- **THEN** SHALL 显示确认对话框
- **AND** 用户确认后 SHALL 发送停止命令到主进程
- **AND** Gateway 状态 SHALL 变为 Stopped

### Requirement: 重启服务操作
系统 SHALL 提供重启 Gateway 服务的快捷操作。

#### Scenario: 点击 Restart 按钮
- **WHEN** 用户点击 Restart 按钮
- **THEN** SHALL 发送重启命令到主进程
- **AND** SHALL 显示加载状态
- **AND** 重启完成后 SHALL 更新状态显示

### Requirement: 打开配置操作
系统 SHALL 提供打开配置界面的快捷操作。

#### Scenario: 点击 Config 按钮
- **WHEN** 用户点击 Config 按钮
- **THEN** SHALL 导航到 Config 页面（或打开配置面板）

### Requirement: 操作按钮状态管理
操作按钮 SHALL 根据当前系统状态显示不同样式。

#### Scenario: 操作按钮样式
- **WHEN** Dashboard 加载
- **THEN** Restart 按钮 SHALL 为主按钮样式（蓝色背景）
- **AND** Stop 和 Config 按钮 SHALL 为次要样式（透明背景）
- **AND** 按钮 SHALL 有对应的图标

### Requirement: 操作确认机制
高风险操作 SHALL 需要用户确认。

#### Scenario: 停止服务确认
- **WHEN** 用户点击 Stop 按钮
- **THEN** SHALL 弹出确认对话框显示 "确定要停止服务吗？"
- **AND** 用户点击取消 SHALL 不执行操作
- **AND** 用户点击确定 SHALL 执行停止操作

### Requirement: 操作反馈
操作执行后 SHALL 提供视觉反馈。

#### Scenario: 操作成功反馈
- **WHEN** 操作成功执行
- **THEN** SHALL 显示成功提示（Toast 或 Alert）
- **AND** 状态显示 SHALL 相应更新

#### Scenario: 操作失败反馈
- **WHEN** 操作执行失败
- **THEN** SHALL 显示错误提示
- **AND** SHALL 显示错误原因
