export type InstallStatus = 'unknown' | 'checking' | 'installed' | 'not_installed';
export type GatewayAction = 'start' | 'stop' | 'restart' | 'status' | 'install' | 'uninstall';
export type GatewayServiceStatus = 'running' | 'stopped' | 'starting' | 'stopping' | 'unknown';

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

export interface OpenClawConfig {
  gateway: GatewayConfig;
  [key: string]: unknown;
}

export interface ConfigState {
  installStatus: InstallStatus;
  openclawInfo: OpenClawInfo | null;
  gatewayStatus: GatewayServiceStatus;
  config: OpenClawConfig | null;
  isExecuting: boolean;
  commandOutput: string;
  error: string | null;
}

export interface ConfigActions {
  checkInstallation: () => Promise<void>;
  executeGatewayAction: (action: GatewayAction) => Promise<void>;
  loadConfig: () => Promise<void>;
  updateConfigField: (key: string, value: unknown) => void;
  saveConfig: () => Promise<void>;
  runDoctor: () => Promise<void>;
  importMigration: (fileData: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export type ConfigStore = ConfigState & ConfigActions;
