# gateway-monitor Specification

## Purpose

监控 Gateway 服务进程和端口状态，提供 Gateway 运行状态的实时检测功能。

## Requirements
### Requirement: Gateway 进程状态检测
系统 SHALL 能够检测 Gateway 服务进程的运行状态。

#### Scenario: Gateway 运行中
- **WHEN** Gateway 进程正在运行
- **THEN** 系统 SHALL 返回 `running` 状态
- **AND** SHALL 显示 "Running" 文本

#### Scenario: Gateway 未运行
- **WHEN** Gateway 进程未运行
- **THEN** 系统 SHALL 返回 `stopped` 状态
- **AND** SHALL 显示 "Stopped" 文本

#### Scenario: Gateway 状态未知
- **WHEN** 无法确定 Gateway 状态（权限不足、命令执行失败）
- **THEN** 系统 SHALL 返回 `unknown` 状态
- **AND** SHALL 显示 "Unknown" 文本

### Requirement: Gateway 端口检测
系统 SHALL 能够通过端口检测 Gateway 运行状态。

#### Scenario: 端口检测成功
- **WHEN** Gateway 默认端口（如 8080）正在监听
- **THEN** 系统 SHALL 判定 Gateway 为运行状态

#### Scenario: 端口检测失败
- **WHEN** Gateway 默认端口无响应
- **THEN** 系统 SHALL 判定 Gateway 为停止状态

### Requirement: 跨平台进程检测
系统 SHALL 在不同操作系统上正确检测 Gateway 进程。

#### Scenario: macOS/Linux 进程检测
- **WHEN** 运行在 macOS 或 Linux 系统
- **THEN** 系统 SHALL 使用 `pgrep` 或类似命令检测进程

#### Scenario: Windows 进程检测
- **WHEN** 运行在 Windows 系统
- **THEN** 系统 SHALL 使用 `tasklist` 或 PowerShell 命令检测进程

