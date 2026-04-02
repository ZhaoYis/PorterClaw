export type MigrateStatus = 'idle' | 'scanning' | 'packing' | 'done' | 'error';

export interface MigrateCategory {
  key: string;
  fileCount: number;
  totalSize: number;
  path: string;
  files: string[];
}

export interface MigratePackage {
  id: string;
  filename: string;
  createdAt: string;
  size: string;
  filePath: string;
  categories: string[];
}

export interface MigratePackResult {
  filePath: string;
  filename: string;
  size: number;
  categories: string[];
}

export interface MigrateImportResult {
  success: boolean;
  restoredCategories: string[];
  fileCount: number;
  error?: string;
}

export interface MigrateState {
  status: MigrateStatus;
  progress: number;
  selectedCategories: Record<string, boolean>;
  categories: MigrateCategory[];
  packages: MigratePackage[];
  currentPackage: MigratePackage | null;
  error: string | null;
}

export interface MigrateActions {
  scanFiles: () => Promise<void>;
  toggleCategory: (key: string, value: boolean) => void;
  startPacking: () => Promise<void>;
  loadPackages: () => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  exportPackage: (id: string) => void;
  setError: (error: string | null) => void;
}

export type MigrateStore = MigrateState & MigrateActions;

export interface MigrateAPI {
  scan: () => Promise<{ success: boolean; categories: MigrateCategory[]; error?: string }>;
  pack: (categories: string[]) => Promise<{ success: boolean; filePath?: string; filename?: string; size?: number; error?: string }>;
  importZip: () => Promise<{ success: boolean; restoredCategories?: string[]; fileCount?: number; error?: string }>;
  onProgress: (callback: (progress: number) => void) => void;
  removeProgressListener: () => void;
}
