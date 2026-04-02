export type InstallStatus = 'unknown' | 'checking' | 'installed' | 'not_installed';
export type GatewayAction = 'start' | 'stop' | 'restart' | 'status' | 'install' | 'uninstall';
export type GatewayServiceStatus = 'running' | 'stopped' | 'starting' | 'stopping' | 'unknown';
export type InstallPhase = 'idle' | 'checking_prereqs' | 'installing_node' | 'installing_openclaw' | 'verifying' | 'success' | 'error';

export interface InstallError {
  message: string;
  solution: string;
}

export interface ComponentStatus {
  name: string;
  installed: boolean;
  version?: string;
  requiredVersion?: string;
}

export interface EnvironmentStatus {
  os: string;
  components: ComponentStatus[];
}

export interface OpenClawInfo {
  installed: boolean;
  version: string;
  configPath: string;
}

export interface GatewayConfig {
  port: number;
  host: string;
  authToken?: string;
  daemon: boolean;
}

export type ProviderType = 'openai' | 'anthropic' | 'azure' | 'local' | 'custom';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ProviderConfig {
  type: ProviderType;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface SkillsConfig {
  directory: string;
  autoLoad: boolean;
}

export interface LoggingConfig {
  level: LogLevel;
  file: string;
}

export interface OpenClawConfig {
  gateway: GatewayConfig;
  provider: ProviderConfig;
  skills: SkillsConfig;
  logging: LoggingConfig;
  [key: string]: unknown;
}

export type SetupStep = 'gateway' | 'provider' | 'advanced' | 'review';

export interface ConfigState {
  installStatus: InstallStatus;
  installPhase: InstallPhase;
  installLogs: string[];
  installError: InstallError | null;
  envStatus: EnvironmentStatus | null;
  openclawInfo: OpenClawInfo | null;
  gatewayStatus: GatewayServiceStatus;
  config: OpenClawConfig | null;
  isExecuting: boolean;
  commandOutput: string;
  error: string | null;
  setupStep: SetupStep | null;
  configDirty: boolean;
}

export interface ConfigActions {
  checkInstallation: () => Promise<void>;
  assessEnvironment: () => Promise<void>;
  autoInstallOpenClaw: () => Promise<void>;
  resetInstallState: () => void;
  executeGatewayAction: (action: GatewayAction) => Promise<void>;
  loadConfig: () => Promise<void>;
  updateConfigField: (key: string, value: unknown) => void;
  saveConfig: () => Promise<void>;
  runDoctor: () => Promise<void>;
  importMigration: () => Promise<void>;
  setError: (error: string | null) => void;
  startSetupWizard: () => void;
  setSetupStep: (step: SetupStep) => void;
  closeSetupWizard: () => void;
}

export type ConfigStore = ConfigState & ConfigActions;
