import { create } from 'zustand';
import type { MigrateStore } from '@common/types/migrate';
import {
  scanCategories,
  packData,
  getPackages,
  deletePackageById,
} from '../services/migrateService';

export const useMigrateStore = create<MigrateStore>((set, get) => ({
  status: 'idle',
  progress: 0,
  selectedCategories: {},
  categories: [],
  packages: [],
  currentPackage: null,
  error: null,

  scanFiles: async () => {
    try {
      set({ status: 'scanning', error: null });
      const categories = await scanCategories();

      const selected: Record<string, boolean> = {};
      for (const cat of categories) {
        const prev = get().selectedCategories[cat.key];
        selected[cat.key] = prev !== undefined ? prev : true;
      }

      set({ status: 'idle', categories, selectedCategories: selected });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Scan failed',
      });
    }
  },

  toggleCategory: (key: string, value: boolean) => {
    set({ selectedCategories: { ...get().selectedCategories, [key]: value } });
  },

  startPacking: async () => {
    try {
      const { selectedCategories } = get();
      const keys = Object.entries(selectedCategories)
        .filter(([, v]) => v)
        .map(([k]) => k);

      if (keys.length === 0) return;

      set({ status: 'packing', progress: 0, error: null });

      const pkg = await packData(keys, (progress) => {
        set({ progress });
      });

      set({
        status: 'done',
        progress: 100,
        currentPackage: pkg,
        packages: getPackages(),
      });

      setTimeout(() => {
        set({ status: 'idle', progress: 0 });
      }, 3000);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Packing failed';
      if (msg === 'User cancelled') {
        set({ status: 'idle', progress: 0 });
      } else {
        set({ status: 'error', error: msg });
      }
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

  exportPackage: (_id: string) => {
    // Package files are already saved on disk via dialog
  },

  setError: (error) => set({ error }),
}));
