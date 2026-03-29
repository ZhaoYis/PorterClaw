/**
 * Migrate Service
 * Handles packing OpenClaw data for migration
 */

import type { MigratePackage, MigrateOptions } from '@common/types/migrate';

const STORAGE_KEY = 'porterclaw_migrate_packages';

function loadPackages(): MigratePackage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function savePackages(packages: MigratePackage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  } catch { /* ignore */ }
}

/**
 * Simulate packing process with progress updates
 */
export async function packData(
  options: MigrateOptions,
  onProgress: (progress: number) => void
): Promise<MigratePackage> {
  const steps = [
    { label: 'Collecting configuration...', duration: 800 },
    { label: 'Gathering logs...', duration: 600 },
    { label: 'Exporting database...', duration: 1200 },
    { label: 'Packaging skills...', duration: 500 },
    { label: 'Compressing archive...', duration: 1000 },
    { label: 'Finalizing...', duration: 400 },
  ];

  const activeSteps = steps.filter((_, i) => {
    if (i === 0) return options.includeConfig;
    if (i === 1) return options.includeLogs;
    if (i === 2) return options.includeData;
    if (i === 3) return options.includeSkills;
    return true;
  });

  let completed = 0;
  for (const step of activeSteps) {
    await new Promise((resolve) => setTimeout(resolve, step.duration));
    completed++;
    onProgress(Math.round((completed / activeSteps.length) * 100));
  }

  const now = new Date();
  const filename = `openclaw-migration-${now.toISOString().slice(0, 10)}-${now.getTime().toString(36)}.zip`;

  // Estimate size
  let sizeKB = 0;
  if (options.includeConfig) sizeKB += 15;
  if (options.includeLogs) sizeKB += Math.floor(Math.random() * 500 + 100);
  if (options.includeData) sizeKB += Math.floor(Math.random() * 2000 + 500);
  if (options.includeSkills) sizeKB += Math.floor(Math.random() * 300 + 50);

  const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

  const pkg: MigratePackage = {
    id: `pkg-${now.getTime()}`,
    filename,
    createdAt: now.toISOString(),
    size: sizeStr,
    options,
  };

  // Save to history
  const packages = loadPackages();
  packages.unshift(pkg);
  savePackages(packages);

  return pkg;
}

/**
 * Get package history
 */
export function getPackages(): MigratePackage[] {
  return loadPackages();
}

/**
 * Delete a package
 */
export function deletePackageById(id: string): MigratePackage[] {
  const packages = loadPackages().filter((p) => p.id !== id);
  savePackages(packages);
  return packages;
}

/**
 * Export/download a package (simulated)
 */
export function exportPackageById(id: string): void {
  const packages = loadPackages();
  const pkg = packages.find((p) => p.id === id);
  if (!pkg) return;

  // Simulate download
  const content = JSON.stringify(
    {
      type: 'openclaw-migration',
      version: '1.0',
      filename: pkg.filename,
      createdAt: pkg.createdAt,
      options: pkg.options,
      data: '(simulated migration data)',
    },
    null,
    2
  );

  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = pkg.filename.replace('.zip', '.json');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
