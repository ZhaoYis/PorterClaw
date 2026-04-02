import { create } from 'zustand';
import type { ConfigStore, GatewayAction, OpenClawConfig, SetupStep } from '@common/types/config';
import {
  checkOpenClawInstalled,
  checkGatewayStatus,
  executeGatewayAction as execAction,
  loadOpenClawConfig,
  saveOpenClawConfig,
  getDefaultConfig,
  runDoctor as execDoctor,
} from '../services/configService';

export const useConfigStore = create<ConfigStore>((set, get) => ({
  installStatus: 'unknown',
  installPhase: 'idle',
  installLogs: [],
  installError: null,
  envStatus: null,
  openclawInfo: null,
  gatewayStatus: 'unknown',
  config: null,
  isExecuting: false,
  commandOutput: '',
  error: null,
  setupStep: null,
  configDirty: false,

  checkInstallation: async () => {
    try {
      set({ installStatus: 'checking', error: null });
      const info = await checkOpenClawInstalled();
      const gwStatus = await checkGatewayStatus();
      set({
        installStatus: info.installed ? 'installed' : 'not_installed',
        openclawInfo: info,
        gatewayStatus: gwStatus,
      });
    } catch (error) {
      set({
        installStatus: 'unknown',
        error: error instanceof Error ? error.message : 'Failed to check installation',
      });
    }
  },

  assessEnvironment: async () => {
    const { checkSystemEnvironment } = await import('../services/configService');
    try {
      set({ isExecuting: true, error: null });
      const env = await checkSystemEnvironment();
      set({ envStatus: env, isExecuting: false });
    } catch (error) {
      set({
        isExecuting: false,
        error: error instanceof Error ? error.message : 'Failed to assess environment',
      });
    }
  },

  resetInstallState: () => {
    set({
      installPhase: 'idle',
      installLogs: [],
      installError: null,
    });
  },

  autoInstallOpenClaw: async () => {
    const { executeAutoInstall } = await import('../services/configService');
    
    set({
      installPhase: 'checking_prereqs',
      installLogs: [],
      installError: null,
      isExecuting: true,
      error: null,
    });

    try {
      await executeAutoInstall(
        (logLine) => set((state) => ({ installLogs: [...state.installLogs, logLine] })),
        (phase) => set({ installPhase: phase }),
      );

      const info = await checkOpenClawInstalled();
      set({
        installStatus: info.installed ? 'installed' : 'not_installed',
        openclawInfo: info,
        isExecuting: false,
      });
    } catch (e: any) {
      set({
        installPhase: 'error',
        installError: {
          message: e.message || 'Unknown installation error',
          solution: e.solution || 'Please check the logs and manually attempt installation via terminal.',
        },
        isExecuting: false,
      });
    }
  },

  executeGatewayAction: async (action: GatewayAction) => {
    try {
      set({ isExecuting: true, error: null });
      const output = await execAction(action);
      set({ commandOutput: output, isExecuting: false });

      const gwStatus = await checkGatewayStatus();
      set({ gatewayStatus: gwStatus });
    } catch (error) {
      set({
        isExecuting: false,
        error: error instanceof Error ? error.message : 'Failed to execute action',
      });
    }
  },

  loadConfig: async () => {
    try {
      set({ isExecuting: true, error: null });
      const config = await loadOpenClawConfig();
      set({ config, isExecuting: false, configDirty: false });
    } catch (error) {
      set({
        isExecuting: false,
        error: error instanceof Error ? error.message : 'Failed to load config',
      });
    }
  },

  updateConfigField: (key: string, value: unknown) => {
    const config = get().config;
    if (!config) return;

    const keys = key.split('.');
    const updated = { ...config };
    let current: any = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    set({ config: updated as OpenClawConfig, configDirty: true });
  },

  saveConfig: async () => {
    const config = get().config;
    if (!config) return;
    try {
      set({ isExecuting: true, error: null });
      await saveOpenClawConfig(config);
      set({ isExecuting: false, commandOutput: 'Configuration saved successfully', configDirty: false });
    } catch (error) {
      set({
        isExecuting: false,
        error: error instanceof Error ? error.message : 'Failed to save config',
      });
    }
  },

  runDoctor: async () => {
    try {
      set({ isExecuting: true, error: null });
      const output = await execDoctor();
      set({ commandOutput: output, isExecuting: false });
    } catch (error) {
      set({
        isExecuting: false,
        error: error instanceof Error ? error.message : 'Doctor failed',
      });
    }
  },

  importMigration: async () => {
    try {
      set({ isExecuting: true, error: null });
      const { importMigrationZip } = await import('../services/migrateService');
      const result = await importMigrationZip();
      set({
        isExecuting: false,
        commandOutput: `Migration imported: ${result.fileCount} files restored`,
      });
    } catch (error) {
      set({ isExecuting: false });
      throw error;
    }
  },

  setError: (error) => set({ error }),

  startSetupWizard: () => {
    const config = get().config;
    if (!config) {
      set({ config: getDefaultConfig() });
    }
    set({ setupStep: 'gateway' });
  },

  setSetupStep: (step: SetupStep) => {
    set({ setupStep: step });
  },

  closeSetupWizard: () => {
    set({ setupStep: null });
  },
}));
