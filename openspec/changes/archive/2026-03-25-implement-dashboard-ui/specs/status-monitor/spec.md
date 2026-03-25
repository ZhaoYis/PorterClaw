## ADDED Requirements

### Requirement: Gateway 状态检测
系统 SHALL 能够检测并显示 Gateway 服务的运行状态。

#### Scenario: Gateway 运行中
- **WHEN** Gateway 服务正常运行
- **THEN** Gateway 资源卡片 SHALL 显示绿色指示点
- **AND** SHALL 显示 "Running" 状态文本

#### Scenario: Gateway 停止
- **WHEN** Gateway 服务停止
- **THEN** Gateway 资源卡片 SHALL 显示红色指示点
- **AND** SHALL 显示 "Stopped" 状态文本

### Requirement: Node 连接状态
系统 SHALL 能够检测并显示 Node 的连接状态。

#### Scenario: Node 已连接
- **WHEN** Node 与 Gateway 建立连接
- **THEN** Node 资源卡片 SHALL 显示绿色指示点
- **AND** SHALL 显示 "Connected" 状态文本

#### Scenario: Node 未连接
- **WHEN** Node 未与 Gateway 建立连接
- **THEN** Node 资源卡片 SHALL 显示红色指示点
- **AND** SHALL 显示 "Disconnected" 状态文本

### Requirement: 状态实时更新
系统 SHALL 定期刷新状态信息。

#### Scenario: 状态变化
- **WHEN** Gateway 或 Node 状态发生变化
- **THEN** Dashboard SHALL 在 5 秒内更新状态显示
- **AND** 状态指示器颜色 SHALL 相应变化

### Requirement: 状态数据获取
系统 SHALL 通过 IPC 从主进程获取状态数据。

#### Scenario: IPC 通信
- **WHEN** Dashboard 组件挂载
- **THEN** SHALL 通过 `dashboard:status` IPC 频道请求状态数据
- **AND** 主进程 SHALL 返回当前 Gateway 和 Node 状态
