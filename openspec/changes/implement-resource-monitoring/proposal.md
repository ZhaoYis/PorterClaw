## Why

当前 Dashboard 页面的资源监控卡片（Gateway、Node、Memory、Active Skills）显示的是硬编码的模拟数据。为了提供真实的系统监控功能，需要从实际环境中读取这些数据，让用户能够实时了解系统状态。

## What Changes

- 实现 **Gateway 状态监控**：检测 OpenClaw Gateway 进程是否运行
- 实现 **Node 状态监控**：检测与 Gateway 连接的节点状态
- 实现 **Memory 使用监控**：读取当前进程和系统的内存使用情况
- 实现 **Active Skills 计数**：统计当前活跃的技能/任务数量
- 更新 IPC 通信层，提供真实数据获取接口
- 更新 Dashboard 组件，从 IPC 获取实时数据

## Capabilities

### New Capabilities
- `gateway-monitor`: Gateway 服务状态检测（进程检测/端口检测）
- `node-monitor`: Node 连接状态监控
- `system-metrics`: 系统资源指标采集（内存、CPU等）
- `skills-counter`: 活跃技能/任务计数

### Modified Capabilities
- `resource-metrics`: 从模拟数据改为真实环境数据
- `status-monitor`: 集成新的监控能力

## Impact

- **新增文件**:
  - `src/main/monitoring/gatewayMonitor.ts` - Gateway 状态检测
  - `src/main/monitoring/nodeMonitor.ts` - Node 状态监控
  - `src/main/monitoring/systemMetrics.ts` - 系统指标采集
  - `src/main/monitoring/skillsCounter.ts` - 技能计数
  - `src/main/monitoring/index.ts` - 监控模块入口

- **修改文件**:
  - `src/main/ipc/dashboardHandlers.ts` - 更新 IPC 处理程序
  - `src/renderer/stores/dashboardStore.ts` - 更新状态管理
  - `src/renderer/components/ResourceGrid.tsx` - 显示真实数据

- **新增依赖**:
  - 可能需要 `systeminformation` 包获取系统指标
  - 或使用 Node.js 原生模块（`os`、`child_process`）

- **跨平台考虑**:
  - Windows/Linux/macOS 进程检测方式不同
  - 需要处理不同平台的兼容性
