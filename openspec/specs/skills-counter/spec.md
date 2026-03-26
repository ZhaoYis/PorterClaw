# skills-counter Specification

## Purpose

统计并显示当前活跃的技能/任务数量，支持从 Gateway API 或本地数据库获取数据。

## Requirements

### Requirement: 活跃技能计数
系统 SHALL 能够统计当前活跃的技能/任务数量。

#### Scenario: 有活跃技能
- **WHEN** 查询活跃技能数量
- **THEN** 系统 SHALL 返回当前正在运行的技能数量
- **AND** SHALL 以数字形式显示

#### Scenario: 无活跃技能
- **WHEN** 没有活跃的技能
- **THEN** 系统 SHALL 返回 0
- **AND** SHALL 显示 "0"

### Requirement: 技能数据来源
系统 SHALL 从正确的数据源获取技能信息。

#### Scenario: 从 Gateway API 获取
- **WHEN** Gateway 正在运行
- **THEN** 系统 SHALL 通过 Gateway API 查询活跃技能列表
- **AND** SHALL 返回技能数量

#### Scenario: 从数据库获取
- **WHEN** 技能信息存储在本地数据库
- **THEN** 系统 SHALL 查询数据库中的活跃任务记录
- **AND** SHALL 返回计数结果

#### Scenario: 数据源不可用
- **WHEN** 无法获取技能信息
- **THEN** 系统 SHALL 返回 0 或 "N/A"
