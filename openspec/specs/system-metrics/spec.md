# system-metrics Specification

## Purpose

监控应用进程和系统的内存、CPU 使用情况，提供实时资源指标数据。

## Requirements

### Requirement: 内存使用监控
系统 SHALL 能够监控应用进程和系统的内存使用情况。

#### Scenario: 获取应用内存使用
- **WHEN** 查询应用内存使用情况
- **THEN** 系统 SHALL 返回当前进程的 RSS 内存使用量
- **AND** 单位 SHALL 为 MB

#### Scenario: 获取系统内存信息
- **WHEN** 查询系统内存信息
- **THEN** 系统 SHALL 返回总内存和可用内存
- **AND** SHALL 计算内存使用百分比

#### Scenario: 内存数据显示
- **WHEN** Dashboard 显示内存信息
- **THEN** SHALL 显示进度条表示使用比例
- **AND** SHALL 显示 "已使用 / 总量" 格式的文本

### Requirement: 内存使用百分比计算
系统 SHALL 正确计算内存使用百分比。

#### Scenario: 正常内存使用
- **WHEN** 内存使用率在 0-80% 之间
- **THEN** 进度条 SHALL 使用绿色渐变

#### Scenario: 内存使用警告
- **WHEN** 内存使用率在 80-90% 之间
- **THEN** 进度条 SHALL 使用黄色/橙色渐变

#### Scenario: 内存使用危险
- **WHEN** 内存使用率超过 90%
- **THEN** 进度条 SHALL 使用红色渐变

### Requirement: CPU 使用监控（可选）
系统 SHALL 能够监控 CPU 使用情况。

#### Scenario: 获取 CPU 使用率
- **WHEN** 查询 CPU 使用情况
- **THEN** 系统 SHALL 返回当前 CPU 使用百分比
