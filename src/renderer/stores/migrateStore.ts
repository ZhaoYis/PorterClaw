import { create } from 'zustand';
import type { MigrateStore, MigrateOptions } from '@common/types/migrate';
import {
  packData,
  getPackages,
  deletePackageById,
  exportPackageById,
} from '../services/migrateService';

export const useMigrateStore = create<MigrateStore>((set, get) => ({
  status: 'idle',
  progress: 0,
  options: {
    includeConfig: true,
    includeLogs: true,
    includeData: true,
    includeSkills: true,
  },
  packages: [],
  currentPackage: null,
  error: null,

  setOption: (key: keyof MigrateOptions, value: boolean) => {
    set({ options: { ...get().options, [key]: value } });
  },

  startPacking: async () => {
    try {
      set({ status: 'packing', progress: 0, error: null });

      const pkg = await packData(get().options, (progress) => {
        set({ progress });
      });

      set({
        status: 'done',
        progress: 100,
        currentPackage: pkg,
        packages: getPackages(),
      });

      // Reset status after delay
      setTimeout(() => {
        set({ status: 'idle', progress: 0 });
      }, 3000);
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Packing failed',
      });
    }
  },

  loadPackages: async () => {
    const packages = getPackages();
    set({ packages });
  },

  deletePackage: async (id: string) => {
    const packages = deletePackageById(id);
    set({ packages });
  },

  exportPackage: (id: string) => {
    exportPackageById(id);
  },

  setError: (error) => set({ error }),
}));
