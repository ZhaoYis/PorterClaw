## Purpose

提供 Dashboard 资源监控功能，显示内存使用、活跃技能数、应用版本和运行时间等信息。

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

### Requirement: 资源指标数据获取
系统 SHALL 从真实环境获取资源监控数据，而非使用模拟数据。

#### Scenario: 获取完整资源数据
- **WHEN** 渲染进程请求资源指标
- **THEN** 系统 SHALL 返回真实的 Gateway 状态、Node 状态、内存使用、活跃技能数
- **AND** 数据 SHALL 反映当前系统实际状态

#### Scenario: 数据刷新
- **WHEN** 定时刷新间隔到达（默认 5 秒）
- **THEN** 系统 SHALL 重新采集所有资源指标
- **AND** SHALL 更新 UI 显示

#### Scenario: 数据获取失败
- **WHEN** 某项指标获取失败
- **THEN** 系统 SHALL 返回默认值或错误状态
- **AND** SHALL 不影响其他指标的显示

### Requirement: 资源指标 IPC 接口
系统 SHALL 提供 IPC 接口供渲染进程获取资源指标。

#### Scenario: 调用 metrics 接口
- **WHEN** 渲染进程调用 `dashboard:metrics` IPC
- **THEN** 主进程 SHALL 返回包含所有指标的完整数据对象
- **AND** 数据结构 SHALL 与现有类型定义兼容
