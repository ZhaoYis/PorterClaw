## Context

PorterClaw 是 OpenClaw 的管理工具，需要实时监控 Gateway 服务状态、连接节点、系统资源使用情况。当前所有监控数据都是硬编码的模拟值，需要实现真实的监控逻辑。

## Goals / Non-Goals

**Goals:**
- 实现真实的 Gateway 进程检测
- 实现 Node 连接状态监控
- 实现系统内存使用监控
- 实现活跃技能计数
- 提供 IPC 接口供渲染进程调用

**Non-Goals:**
- 实现历史数据记录和图表
- 实现告警通知功能
- 实现远程监控能力

## Decisions

### 1. Gateway 状态检测方案
- **决策**: 通过检测进程名 `openclaw-gateway` 或检测默认端口 (如 8080) 判断运行状态
- **理由**: 简单可靠，跨平台兼容
- **实现**: 使用 `child_process` 执行 `pgrep`/`tasklist` 命令，或 `netstat` 检测端口

### 2. Node 状态监控方案
- **决策**: 通过 Gateway API 查询连接的节点列表
- **理由**: Gateway 维护节点连接信息，直接查询最准确
- **备选方案**: 通过配置文件读取（不实时）

### 3. 内存监控方案
- **决策**: 使用 Node.js 原生 `process.memoryUsage()` + `os` 模块
- **理由**: 无需额外依赖，跨平台兼容
- **数据**:
  - 应用内存: `process.memoryUsage().rss`
  - 系统内存: `os.totalmem()` / `os.freemem()`

### 4. 活跃技能计数方案
- **决策**: 通过 Gateway API 或数据库查询活跃任务数
- **理由**: 技能/任务数据由 Gateway 管理
- **备选方案**: 通过 SQLite 数据库查询（如果任务存储在本地）

### 5. IPC 通信设计
- **决策**: 扩展现有 `dashboard:metrics` 接口返回真实数据
- **频道**:
  - `dashboard:metrics` - 返回所有监控数据
  - `monitoring:refresh` - 手动刷新数据

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 进程检测跨平台差异 | 封装平台检测逻辑，提供统一接口 |
| Gateway API 不可用 | 提供降级策略，返回 "Unknown" 状态 |
| 频繁查询影响性能 | 设置合理的刷新间隔（默认 5 秒） |
| 权限问题（某些系统命令） | 使用 Node.js 原生 API 优先 |

## Migration Plan

1. 创建监控模块目录结构
2. 实现各个监控器
3. 更新 IPC 处理程序
4. 更新渲染进程状态管理
5. 测试验证

回滚策略: 恢复硬编码数据逻辑。
