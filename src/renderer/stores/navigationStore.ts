import { create } from 'zustand';

export type PageKey = 'dashboard' | 'config' | 'logs' | 'migrate' | 'settings';

interface NavigationStore {
  activePage: PageKey;
  navigate: (page: PageKey) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  activePage: 'dashboard',
  navigate: (page) => set({ activePage: page }),
}));
