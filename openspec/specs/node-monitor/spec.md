# node-monitor Specification

## Purpose

监控与 Gateway 连接的节点状态，通过 Gateway API 查询节点连接信息。

## Requirements
### Requirement: Node 连接状态监控
系统 SHALL 能够监控与 Gateway 连接的节点状态。

#### Scenario: 节点已连接
- **WHEN** 有节点与 Gateway 建立连接
- **THEN** 系统 SHALL 返回 `connected` 状态
- **AND** SHALL 显示 "Connected" 文本

#### Scenario: 节点未连接
- **WHEN** 没有节点与 Gateway 连接
- **THEN** 系统 SHALL 返回 `disconnected` 状态
- **AND** SHALL 显示 "Disconnected" 文本

### Requirement: Node 状态查询接口
系统 SHALL 提供查询节点状态的接口。

#### Scenario: 通过 Gateway API 查询
- **WHEN** Gateway 正在运行
- **THEN** 系统 SHALL 通过 Gateway API 查询节点列表
- **AND** SHALL 返回节点数量和状态

#### Scenario: Gateway 不可用时
- **WHEN** Gateway 未运行或无法访问
- **THEN** 系统 SHALL 返回 `unavailable` 状态
- **AND** SHALL 显示 "Unavailable" 文本

