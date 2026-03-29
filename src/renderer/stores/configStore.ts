import { create } from 'zustand';
import type { ConfigStore, GatewayAction, OpenClawConfig } from '@common/types/config';
import {
  checkOpenClawInstalled,
  checkGatewayStatus,
  executeGatewayAction as execAction,
  loadOpenClawConfig,
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

  autoInstallOpenClaw: async (simulateError = false) => {
    const { simulateAutoInstall } = await import('../services/configService');
    
    set({
      installPhase: 'checking_prereqs',
      installLogs: [],
      installError: null,
      isExecuting: true,
      error: null,
    });

    try {
      await simulateAutoInstall(
        (logLine) => set((state) => ({ installLogs: [...state.installLogs, logLine] })),
        (phase) => set({ installPhase: phase }),
        simulateError
      );

      // On success, refresh the ultimate status as if it really installed
      const info = await checkOpenClawInstalled();
      set({
        installStatus: 'installed',
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

      // Refresh gateway status after action
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
      set({ config, isExecuting: false });
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
    set({ config: updated as OpenClawConfig });
  },

  saveConfig: async () => {
    try {
      set({ isExecuting: true, error: null });
      // In web mode, just log; Electron mode would write to file
      console.log('Config saved:', get().config);
      set({ isExecuting: false, commandOutput: 'Configuration saved successfully' });
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

  importMigration: async (fileData: string) => {
    try {
      set({ isExecuting: true, error: null });
      console.log('Importing migration data...', fileData.substring(0, 100));
      // Simulate import
      await new Promise((resolve) => setTimeout(resolve, 1500));
      set({ isExecuting: false, commandOutput: 'Migration imported successfully' });
    } catch (error) {
      set({
        isExecuting: false,
        error: error instanceof Error ? error.message : 'Import failed',
      });
    }
  },

  setError: (error) => set({ error }),
}));
