export type MigrateStatus = 'idle' | 'packing' | 'done' | 'error';

export interface MigrateOptions {
  includeConfig: boolean;
  includeLogs: boolean;
  includeData: boolean;
  includeSkills: boolean;
}

export interface MigratePackage {
  id: string;
  filename: string;
  createdAt: string;
  size: string;
  options: MigrateOptions;
}

export interface MigrateState {
  status: MigrateStatus;
  progress: number;
  options: MigrateOptions;
  packages: MigratePackage[];
  currentPackage: MigratePackage | null;
  error: string | null;
}

export interface MigrateActions {
  setOption: (key: keyof MigrateOptions, value: boolean) => void;
  startPacking: () => Promise<void>;
  loadPackages: () => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  exportPackage: (id: string) => void;
  setError: (error: string | null) => void;
}

export type MigrateStore = MigrateState & MigrateActions;
