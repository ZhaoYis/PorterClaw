## 1. 创建监控模块目录结构

- [x] 1.1 创建 `src/main/monitoring/` 目录
- [x] 1.2 创建 `src/main/monitoring/index.ts` 入口文件

## 2. 实现 Gateway 状态监控

- [x] 2.1 创建 `src/main/monitoring/gatewayMonitor.ts`
- [x] 2.2 实现 `checkGatewayProcess()` - 进程检测函数
- [x] 2.3 实现 `checkGatewayPort()` - 端口检测函数
- [x] 2.4 实现跨平台适配（macOS/Linux/Windows）
- [x] 2.5 实现 `getGatewayStatus()` - 统一状态获取接口

## 3. 实现 Node 状态监控

- [x] 3.1 创建 `src/main/monitoring/nodeMonitor.ts`
- [x] 3.2 实现 `queryGatewayAPI()` - Gateway API 查询函数
- [x] 3.3 实现 `getNodeStatus()` - 节点状态获取接口
- [x] 3.4 处理 Gateway 不可用情况

## 4. 实现系统指标监控

- [x] 4.1 创建 `src/main/monitoring/systemMetrics.ts`
- [x] 4.2 实现 `getMemoryUsage()` - 内存使用获取
- [x] 4.3 实现 `getSystemMemory()` - 系统内存信息
- [x] 4.4 实现内存使用百分比计算
- [x] 4.5 实现进度条颜色逻辑（绿/黄/红）

## 5. 实现活跃技能计数

- [x] 5.1 创建 `src/main/monitoring/skillsCounter.ts`
- [x] 5.2 实现 `getActiveSkillsCount()` - 技能计数函数
- [x] 5.3 确定数据源（Gateway API 或数据库）

## 6. 更新 IPC 通信层

- [x] 6.1 更新 `src/main/ipc/dashboardHandlers.ts`
- [x] 6.2 修改 `dashboard:metrics` 处理程序，调用真实监控函数
- [x] 6.3 更新 `dashboard:status` 处理程序
- [x] 6.4 添加错误处理和降级逻辑

## 7. 更新类型定义

- [x] 7.1 更新 `src/common/types/dashboard.ts` 类型（如需要）
- [x] 7.2 添加监控相关的接口类型

## 8. 更新渲染进程

- [x] 8.1 更新 `src/renderer/stores/dashboardStore.ts`（如需要）
- [x] 8.2 更新 `src/renderer/components/ResourceGrid.tsx`（如需要）

## 9. 测试验证

- [x] 9.1 构建项目 `npm run build`
- [x] 9.2 启动应用 `npm run electron:dev`
- [x] 9.3 验证 Gateway 状态正确显示
- [x] 9.4 验证 Node 状态正确显示
- [x] 9.5 验证 Memory 数据正确显示
- [x] 9.6 验证 Active Skills 正确显示
- [x] 9.7 验证跨平台兼容性（至少测试当前系统）

## 10. 提交更改

- [x] 10.1 TypeScript 类型检查通过
- [x] 10.2 提交更改到 git
