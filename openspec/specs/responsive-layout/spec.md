## Requirements

### Requirement: 响应式资源监控网格
资源监控网格 SHALL 根据窗口宽度自动调整列数。

#### Scenario: 小屏幕布局
- **WHEN** 窗口宽度小于 600px
- **THEN** 资源监控网格 SHALL 显示为单列（1列）
- **AND** 每个资源卡片 SHALL 占满整行宽度

#### Scenario: 中等屏幕布局
- **WHEN** 窗口宽度在 600px 到 1200px 之间
- **THEN** 资源监控网格 SHALL 显示为双列（2列）
- **AND** 卡片 SHALL 等分可用宽度

#### Scenario: 大屏幕布局
- **WHEN** 窗口宽度大于 1200px
- **THEN** 资源监控网格 SHALL 可选择显示为三列或保持双列（更宽松）
- **AND** 内容最大宽度 SHALL 限制为 1400px 以保持可读性

### Requirement: 弹性状态卡片布局
状态卡片 SHALL 使用弹性布局，内容自动适应容器宽度。

#### Scenario: 状态卡片自适应
- **WHEN** 窗口宽度变化
- **THEN** 状态卡片 SHALL 保持内部元素水平排列
- **AND** 状态指示器 SHALL 保持固定尺寸
- **AND** 状态元信息 SHALL 右对齐
- **AND** 小窗口下 SHALL 保持最小间距

### Requirement: 自适应快捷操作按钮
快捷操作按钮 SHALL 根据可用宽度自动调整。

#### Scenario: 按钮布局自适应
- **WHEN** 窗口宽度变化
- **THEN** 三个按钮 SHALL 等分可用宽度
- **AND** 按钮间距 SHALL 自动调整
- **AND** 按钮高度 SHALL 保持固定
- **AND** 按钮标签 SHALL 始终可见

### Requirement: 滚动区域自适应
主内容区域 SHALL 在内容超出时显示滚动条。

#### Scenario: 内容超出
- **WHEN** 窗口高度不足以显示所有内容
- **THEN** 主内容区域 SHALL 显示垂直滚动条
- **AND** 导航栏 SHALL 保持固定（不滚动）
- **AND** 滚动条样式 SHALL 与深色主题一致

### Requirement: 字体尺寸自适应
主要内容字体 SHALL 保持固定尺寸，小屏幕下保持可读性。

#### Scenario: 不同窗口尺寸
- **WHEN** 窗口尺寸变化
- **THEN** 标题字体 SHALL 保持 24px（状态标签）
- **AND** 正文字体 SHALL 保持 14px
- **AND** 元信息字体 SHALL 保持 16px
- **AND** SHALL **不**使用 viewport 缩放字体
