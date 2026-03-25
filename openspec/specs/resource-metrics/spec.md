## Requirements

### Requirement: 内存使用监控
系统 SHALL 监控并显示内存使用情况。

#### Scenario: 内存使用率显示
- **WHEN** Dashboard 显示资源监控
- **THEN** Memory 卡片 SHALL 显示进度条
- **AND** 进度条 SHALL 使用蓝绿渐变 (#0066FF to #00C853)
- **AND** SHALL 显示当前使用量 / 总量（如 256MB / 1GB）

#### Scenario: 内存警告
- **WHEN** 内存使用率超过 80%
- **THEN** 进度条颜色 SHALL 变为黄色警告
- **AND** 当超过 90% 时 SHALL 变为红色警告

### Requirement: 活跃技能计数
系统 SHALL 显示当前活跃的技能数量。

#### Scenario: 技能数显示
- **WHEN** Dashboard 显示资源监控
- **THEN** Active Skills 卡片 SHALL 显示大号数字
- **AND** 数字字体 SHALL 为等宽字体
- **AND** 数字颜色 SHALL 为白色

### Requirement: 应用版本信息
系统 SHALL 显示当前应用版本号。

#### Scenario: 版本显示
- **WHEN** Dashboard 加载完成
- **THEN** 状态卡片 SHALL 显示版本号（如 v0.12.3）
- **AND** 版本号 SHALL 使用等宽字体

### Requirement: 运行时间统计
系统 SHALL 显示应用运行时间。

#### Scenario: 运行时间显示
- **WHEN** Dashboard 加载完成
- **THEN** 状态卡片 SHALL 显示运行时间（如 2d 4h 32m）
- **AND** 运行时间 SHALL 每秒更新
- **AND** 格式 SHALL 为 "Xd Xh Xm"
