/**
 * Migrate Service
 * Handles packing OpenClaw data for migration via IPC to the main process
 */

import type { MigrateCategory, MigratePackage } from '@common/types/migrate';
import { isElectronEnvironment } from './monitoringService';

const STORAGE_KEY = 'porterclaw_migrate_packages';

function loadPackagesFromStorage(): MigratePackage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function savePackagesToStorage(packages: MigratePackage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  } catch { /* ignore */ }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export async function scanCategories(): Promise<MigrateCategory[]> {
  if (!isElectronEnvironment()) {
    return [];
  }
  const result = await window.electron.migrate.scan();
  if (!result.success) {
    throw new Error(result.error || 'Failed to scan');
  }
  return result.categories;
}

export async function packData(
  selectedKeys: string[],
  onProgress: (progress: number) => void,
): Promise<MigratePackage> {
  if (!isElectronEnvironment()) {
    throw new Error('Packing is only available in Electron mode');
  }

  window.electron.migrate.onProgress(onProgress);

  try {
    const result = await window.electron.migrate.pack(selectedKeys);

    if (!result.success) {
      throw new Error(result.error || 'Packing failed');
    }

    const pkg: MigratePackage = {
      id: `pkg-${Date.now()}`,
      filename: result.filename!,
      createdAt: new Date().toISOString(),
      size: formatSize(result.size!),
      filePath: result.filePath!,
      categories: selectedKeys,
    };

    const packages = loadPackagesFromStorage();
    packages.unshift(pkg);
    savePackagesToStorage(packages);

    return pkg;
  } finally {
    window.electron.migrate.removeProgressListener();
  }
}

export function getPackages(): MigratePackage[] {
  return loadPackagesFromStorage();
}

export function deletePackageById(id: string): MigratePackage[] {
  const packages = loadPackagesFromStorage().filter((p) => p.id !== id);
  savePackagesToStorage(packages);
  return packages;
}

export async function importMigrationZip(): Promise<{
  restoredCategories: string[];
  fileCount: number;
}> {
  if (!isElectronEnvironment()) {
    throw new Error('Import is only available in Electron mode');
  }

  const result = await window.electron.migrate.importZip();
  if (!result.success) {
    throw new Error(result.error || 'Import failed');
  }

  return {
    restoredCategories: result.restoredCategories || [],
    fileCount: result.fileCount || 0,
  };
}
