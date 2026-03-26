## MODIFIED Requirements

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
