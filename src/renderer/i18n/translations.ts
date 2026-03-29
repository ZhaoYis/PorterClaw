import type { Language } from '@common/types/settings';

type TranslationKey =
  // Nav
  | 'nav.dashboard' | 'nav.config' | 'nav.logs' | 'nav.migrate' | 'nav.settings'
  // Dashboard
  | 'dashboard.running' | 'dashboard.stopped' | 'dashboard.version' | 'dashboard.uptime'
  | 'dashboard.stop' | 'dashboard.restart' | 'dashboard.config'
  | 'dashboard.gateway' | 'dashboard.node' | 'dashboard.memory' | 'dashboard.activeSkills'
  | 'dashboard.connected' | 'dashboard.disconnected'
  // Config
  | 'config.title' | 'config.installCheck' | 'config.notInstalled' | 'config.installed'
  | 'config.installGuide' | 'config.installCommand' | 'config.copyCommand'
  | 'config.checkInstall' | 'config.testService' | 'config.gatewayControl'
  | 'config.start' | 'config.stop' | 'config.restart' | 'config.status'
  | 'config.gatewayStatus' | 'config.configEditor' | 'config.save' | 'config.reset'
  | 'config.importMigration' | 'config.selectFile' | 'config.import' | 'config.doctor'
  | 'config.runDoctor' | 'config.checking' | 'config.port' | 'config.host'
  | 'config.daemon' | 'config.installStep1' | 'config.installStep2' | 'config.installStep3'
  | 'config.installStep1Desc' | 'config.installStep2Desc' | 'config.installStep3Desc'
  | 'config.copied'
  // Logs
  | 'logs.title' | 'logs.all' | 'logs.error' | 'logs.warn' | 'logs.info' | 'logs.debug'
  | 'logs.search' | 'logs.refresh' | 'logs.clear' | 'logs.export'
  | 'logs.autoScroll' | 'logs.noLogs' | 'logs.timeRange'
  | 'logs.1h' | 'logs.6h' | 'logs.24h' | 'logs.7d' | 'logs.allTime'
  // Migrate
  | 'migrate.title' | 'migrate.description' | 'migrate.includeConfig' | 'migrate.includeLogs'
  | 'migrate.includeData' | 'migrate.includeSkills' | 'migrate.startPacking' | 'migrate.packing'
  | 'migrate.done' | 'migrate.history' | 'migrate.noPackages' | 'migrate.delete'
  | 'migrate.export' | 'migrate.packageOptions'
  // Settings
  | 'settings.title' | 'settings.appearance' | 'settings.theme' | 'settings.themeSystem'
  | 'settings.themeLight' | 'settings.themeDark' | 'settings.language' | 'settings.languageEn'
  | 'settings.languageZh' | 'settings.about' | 'settings.version' | 'settings.checkUpdate'
  | 'settings.website' | 'settings.data' | 'settings.clearCache' | 'settings.resetSettings'
  | 'settings.gateway' | 'settings.gatewayPort' | 'settings.gatewayHost'
  | 'settings.resetConfirm' | 'settings.upToDate'
  // Common
  | 'common.confirm' | 'common.cancel' | 'common.loading' | 'common.error'
  | 'common.success' | 'common.save' | 'common.delete' | 'common.confirmAction';

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    // Nav
    'nav.dashboard': 'Dashboard',
    'nav.config': 'Config',
    'nav.logs': 'Logs',
    'nav.migrate': 'Migrate',
    'nav.settings': 'Settings',
    // Dashboard
    'dashboard.running': 'Running',
    'dashboard.stopped': 'Stopped',
    'dashboard.version': 'Version',
    'dashboard.uptime': 'Uptime',
    'dashboard.stop': 'Stop',
    'dashboard.restart': 'Restart',
    'dashboard.config': 'Config',
    'dashboard.gateway': 'Gateway',
    'dashboard.node': 'Node',
    'dashboard.memory': 'Memory',
    'dashboard.activeSkills': 'Active Skills',
    'dashboard.connected': 'Connected',
    'dashboard.disconnected': 'Disconnected',
    // Config
    'config.title': 'OpenClaw Configuration',
    'config.installCheck': 'Installation Status',
    'config.notInstalled': 'OpenClaw is not installed',
    'config.installed': 'OpenClaw is installed',
    'config.installGuide': 'Install OpenClaw',
    'config.installCommand': 'Run the following command to install:',
    'config.copyCommand': 'Copy Command',
    'config.checkInstall': 'Check Installation',
    'config.testService': 'Test Service',
    'config.gatewayControl': 'Gateway Control',
    'config.start': 'Start',
    'config.stop': 'Stop',
    'config.restart': 'Restart',
    'config.status': 'Status',
    'config.gatewayStatus': 'Gateway Status',
    'config.configEditor': 'Configuration',
    'config.save': 'Save Config',
    'config.reset': 'Reset',
    'config.importMigration': 'Import Migration',
    'config.selectFile': 'Select Migration File',
    'config.import': 'Import',
    'config.doctor': 'Diagnostics',
    'config.runDoctor': 'Run Doctor',
    'config.checking': 'Checking...',
    'config.port': 'Port',
    'config.host': 'Host',
    'config.daemon': 'Run as Daemon',
    'config.installStep1': 'Step 1: Install',
    'config.installStep2': 'Step 2: Verify',
    'config.installStep3': 'Step 3: Test',
    'config.installStep1Desc': 'Run the install script to install OpenClaw',
    'config.installStep2Desc': 'Verify the installation was successful',
    'config.installStep3Desc': 'Test that the service starts correctly',
    'config.copied': 'Copied!',
    // Logs
    'logs.title': 'Logs',
    'logs.all': 'All',
    'logs.error': 'Error',
    'logs.warn': 'Warning',
    'logs.info': 'Info',
    'logs.debug': 'Debug',
    'logs.search': 'Search logs...',
    'logs.refresh': 'Refresh',
    'logs.clear': 'Clear',
    'logs.export': 'Export',
    'logs.autoScroll': 'Auto-scroll',
    'logs.noLogs': 'No log entries found',
    'logs.timeRange': 'Time Range',
    'logs.1h': 'Last 1h',
    'logs.6h': 'Last 6h',
    'logs.24h': 'Last 24h',
    'logs.7d': 'Last 7d',
    'logs.allTime': 'All Time',
    // Migrate
    'migrate.title': 'Migration',
    'migrate.description': 'Package your OpenClaw installation for migration to another machine.',
    'migrate.includeConfig': 'Configuration Files',
    'migrate.includeLogs': 'Log Files',
    'migrate.includeData': 'Database & Data',
    'migrate.includeSkills': 'Skills & Plugins',
    'migrate.startPacking': 'Start Packing',
    'migrate.packing': 'Packing...',
    'migrate.done': 'Package Created',
    'migrate.history': 'Package History',
    'migrate.noPackages': 'No packages created yet',
    'migrate.delete': 'Delete',
    'migrate.export': 'Export',
    'migrate.packageOptions': 'Package Options',
    // Settings
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.theme': 'Theme Mode',
    'settings.themeSystem': 'System',
    'settings.themeLight': 'Light',
    'settings.themeDark': 'Dark',
    'settings.language': 'Language',
    'settings.languageEn': 'English',
    'settings.languageZh': '中文',
    'settings.about': 'About',
    'settings.version': 'Version',
    'settings.checkUpdate': 'Check for Updates',
    'settings.website': 'Official Website',
    'settings.data': 'Data Management',
    'settings.clearCache': 'Clear Cache',
    'settings.resetSettings': 'Reset All Settings',
    'settings.gateway': 'Gateway Connection',
    'settings.gatewayPort': 'Gateway Port',
    'settings.gatewayHost': 'Gateway Host',
    'settings.resetConfirm': 'Are you sure you want to reset all settings to defaults?',
    'settings.upToDate': 'You are running the latest version!',
    // Common
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.confirmAction': 'Are you sure?',
  },
  zh: {
    // Nav
    'nav.dashboard': '仪表盘',
    'nav.config': '配置',
    'nav.logs': '日志',
    'nav.migrate': '迁移',
    'nav.settings': '设置',
    // Dashboard
    'dashboard.running': '运行中',
    'dashboard.stopped': '已停止',
    'dashboard.version': '版本',
    'dashboard.uptime': '运行时间',
    'dashboard.stop': '停止',
    'dashboard.restart': '重启',
    'dashboard.config': '配置',
    'dashboard.gateway': '网关',
    'dashboard.node': '节点',
    'dashboard.memory': '内存',
    'dashboard.activeSkills': '活跃技能',
    'dashboard.connected': '已连接',
    'dashboard.disconnected': '未连接',
    // Config
    'config.title': 'OpenClaw 配置',
    'config.installCheck': '安装状态',
    'config.notInstalled': 'OpenClaw 未安装',
    'config.installed': 'OpenClaw 已安装',
    'config.installGuide': '安装 OpenClaw',
    'config.installCommand': '运行以下命令进行安装：',
    'config.copyCommand': '复制命令',
    'config.checkInstall': '检查安装',
    'config.testService': '测试服务',
    'config.gatewayControl': '网关控制',
    'config.start': '启动',
    'config.stop': '停止',
    'config.restart': '重启',
    'config.status': '状态',
    'config.gatewayStatus': '网关状态',
    'config.configEditor': '配置编辑',
    'config.save': '保存配置',
    'config.reset': '重置',
    'config.importMigration': '导入迁移文件',
    'config.selectFile': '选择迁移文件',
    'config.import': '导入',
    'config.doctor': '诊断工具',
    'config.runDoctor': '运行诊断',
    'config.checking': '检查中...',
    'config.port': '端口',
    'config.host': '主机',
    'config.daemon': '守护进程模式',
    'config.installStep1': '步骤 1：安装',
    'config.installStep2': '步骤 2：验证',
    'config.installStep3': '步骤 3：测试',
    'config.installStep1Desc': '运行安装脚本以安装 OpenClaw',
    'config.installStep2Desc': '验证安装是否成功',
    'config.installStep3Desc': '测试服务是否能正常启动',
    'config.copied': '已复制！',
    // Logs
    'logs.title': '日志管理',
    'logs.all': '全部',
    'logs.error': '错误',
    'logs.warn': '警告',
    'logs.info': '信息',
    'logs.debug': '调试',
    'logs.search': '搜索日志...',
    'logs.refresh': '刷新',
    'logs.clear': '清空',
    'logs.export': '导出',
    'logs.autoScroll': '自动滚动',
    'logs.noLogs': '暂无日志记录',
    'logs.timeRange': '时间范围',
    'logs.1h': '最近 1 小时',
    'logs.6h': '最近 6 小时',
    'logs.24h': '最近 24 小时',
    'logs.7d': '最近 7 天',
    'logs.allTime': '全部时间',
    // Migrate
    'migrate.title': '迁移管理',
    'migrate.description': '打包您的 OpenClaw 安装数据，方便迁移到其他机器。',
    'migrate.includeConfig': '配置文件',
    'migrate.includeLogs': '日志文件',
    'migrate.includeData': '数据库和数据',
    'migrate.includeSkills': '技能和插件',
    'migrate.startPacking': '开始打包',
    'migrate.packing': '打包中...',
    'migrate.done': '打包完成',
    'migrate.history': '打包历史',
    'migrate.noPackages': '暂无打包记录',
    'migrate.delete': '删除',
    'migrate.export': '导出',
    'migrate.packageOptions': '打包选项',
    // Settings
    'settings.title': '应用设置',
    'settings.appearance': '外观设置',
    'settings.theme': '主题模式',
    'settings.themeSystem': '跟随系统',
    'settings.themeLight': '日间模式',
    'settings.themeDark': '夜间模式',
    'settings.language': '语言',
    'settings.languageEn': 'English',
    'settings.languageZh': '中文',
    'settings.about': '关于',
    'settings.version': '版本',
    'settings.checkUpdate': '检查更新',
    'settings.website': '官方网站',
    'settings.data': '数据管理',
    'settings.clearCache': '清除缓存',
    'settings.resetSettings': '重置所有设置',
    'settings.gateway': '网关连接',
    'settings.gatewayPort': '网关端口',
    'settings.gatewayHost': '网关主机',
    'settings.resetConfirm': '确定要将所有设置恢复为默认值吗？',
    'settings.upToDate': '当前已是最新版本！',
    // Common
    'common.confirm': '确认',
    'common.cancel': '取消',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.save': '保存',
    'common.delete': '删除',
    'common.confirmAction': '确定执行此操作吗？',
  },
};

export function t(key: TranslationKey, language: Language): string {
  return translations[language]?.[key] ?? translations.en[key] ?? key;
}

export function useTranslation(language: Language) {
  return {
    t: (key: TranslationKey) => t(key, language),
  };
}
