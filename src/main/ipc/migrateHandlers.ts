import { ipcMain, dialog, BrowserWindow } from 'electron';
import fs from 'fs';
import path from 'path';
import os from 'os';
import archiver from 'archiver';
import extract from 'extract-zip';
import { logger } from '../logger';
import type { MigrateCategory } from '@common/types/migrate';

const OPENCLAW_DIR = path.join(os.homedir(), '.openclaw');

const CATEGORY_DEFS: { key: string; subPath: string; isDir: boolean }[] = [
  { key: 'config', subPath: '', isDir: false },
  { key: 'skills', subPath: 'skills', isDir: true },
  { key: 'logs', subPath: 'logs', isDir: true },
  { key: 'data', subPath: 'data', isDir: true },
  { key: 'cache', subPath: 'cache', isDir: true },
  { key: 'plugins', subPath: 'plugins', isDir: true },
  { key: 'templates', subPath: 'templates', isDir: true },
  { key: 'backups', subPath: 'backups', isDir: true },
  { key: 'memory', subPath: 'memory', isDir: true },
  { key: 'agents', subPath: 'agents', isDir: true },
];

const CONFIG_EXTENSIONS = new Set(['.json', '.yaml', '.yml', '.toml', '.conf', '.cfg', '.env']);

function collectDirStats(dirPath: string): { fileCount: number; totalSize: number; files: string[] } {
  let fileCount = 0;
  let totalSize = 0;
  const files: string[] = [];

  function walk(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        try {
          const stat = fs.statSync(fullPath);
          fileCount++;
          totalSize += stat.size;
          files.push(path.relative(OPENCLAW_DIR, fullPath));
        } catch { /* skip unreadable */ }
      }
    }
  }

  walk(dirPath);
  return { fileCount, totalSize, files };
}

function scanCategories(): MigrateCategory[] {
  if (!fs.existsSync(OPENCLAW_DIR)) {
    return [];
  }

  const results: MigrateCategory[] = [];
  const accountedDirs = new Set<string>();

  // Config files at root level
  try {
    const rootEntries = fs.readdirSync(OPENCLAW_DIR, { withFileTypes: true });
    const configFiles: string[] = [];
    let configSize = 0;

    for (const entry of rootEntries) {
      if (entry.isFile() && CONFIG_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        const fullPath = path.join(OPENCLAW_DIR, entry.name);
        try {
          const stat = fs.statSync(fullPath);
          configFiles.push(entry.name);
          configSize += stat.size;
        } catch { /* skip */ }
      }
    }

    if (configFiles.length > 0) {
      results.push({
        key: 'config',
        fileCount: configFiles.length,
        totalSize: configSize,
        path: '~/.openclaw/',
        files: configFiles,
      });
    }
  } catch { /* root unreadable */ }

  // Known subdirectories
  for (const def of CATEGORY_DEFS) {
    if (!def.isDir) continue;
    const dirPath = path.join(OPENCLAW_DIR, def.subPath);
    if (!fs.existsSync(dirPath)) continue;

    try {
      const stat = fs.statSync(dirPath);
      if (!stat.isDirectory()) continue;
    } catch {
      continue;
    }

    const stats = collectDirStats(dirPath);
    if (stats.fileCount === 0) continue;

    accountedDirs.add(def.subPath);
    results.push({
      key: def.key,
      fileCount: stats.fileCount,
      totalSize: stats.totalSize,
      path: `~/.openclaw/${def.subPath}`,
      files: stats.files.slice(0, 20),
    });
  }

  // Any other directories not accounted for -> "other"
  try {
    const rootEntries = fs.readdirSync(OPENCLAW_DIR, { withFileTypes: true });
    let otherCount = 0;
    let otherSize = 0;
    const otherFiles: string[] = [];

    for (const entry of rootEntries) {
      if (entry.isDirectory() && !accountedDirs.has(entry.name)) {
        const dirPath = path.join(OPENCLAW_DIR, entry.name);
        const stats = collectDirStats(dirPath);
        otherCount += stats.fileCount;
        otherSize += stats.totalSize;
        otherFiles.push(...stats.files.slice(0, 5));
      }
    }

    // Root-level non-config files
    for (const entry of rootEntries) {
      if (entry.isFile() && !CONFIG_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        const fullPath = path.join(OPENCLAW_DIR, entry.name);
        try {
          const stat = fs.statSync(fullPath);
          otherCount++;
          otherSize += stat.size;
          otherFiles.push(entry.name);
        } catch { /* skip */ }
      }
    }

    if (otherCount > 0) {
      results.push({
        key: 'other',
        fileCount: otherCount,
        totalSize: otherSize,
        path: '~/.openclaw/',
        files: otherFiles.slice(0, 20),
      });
    }
  } catch { /* skip */ }

  return results;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function registerMigrateHandlers(): void {
  ipcMain.handle('migrate:scan', async () => {
    try {
      const categories = scanCategories();
      logger.info(`Scanned ${categories.length} migrate categories`, 'migrate');
      return { success: true, categories };
    } catch (error) {
      logger.error(`Migrate scan failed: ${(error as Error).message}`, 'migrate');
      return { success: false, categories: [], error: (error as Error).message };
    }
  });

  ipcMain.handle('migrate:pack', async (event, selectedKeys: string[]) => {
    const sender = event.sender;
    const win = BrowserWindow.fromWebContents(sender);

    const categories = scanCategories();
    const selected = categories.filter((c) => selectedKeys.includes(c.key));

    if (selected.length === 0) {
      return { success: false, error: 'No categories selected' };
    }

    const now = new Date();
    const defaultName = `openclaw-migration-${now.toISOString().slice(0, 10)}.zip`;

    const result = await dialog.showSaveDialog(win!, {
      title: 'Save Migration Package',
      defaultPath: defaultName,
      filters: [{ name: 'ZIP Archive', extensions: ['zip'] }],
    });

    if (result.canceled || !result.filePath) {
      return { success: false, error: 'User cancelled' };
    }

    const outputPath = result.filePath;
    logger.info(`Packing migration to ${outputPath}`, 'migrate');

    try {
      const totalFiles = selected.reduce((sum, c) => sum + c.fileCount, 0);
      let packedFiles = 0;

      await new Promise<void>((resolve, reject) => {
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 6 } });

        output.on('close', () => resolve());
        archive.on('error', (err: Error) => reject(err));
        archive.on('entry', () => {
          packedFiles++;
          const pct = Math.min(Math.round((packedFiles / totalFiles) * 100), 99);
          if (!sender.isDestroyed()) {
            sender.send('migrate:progress', pct);
          }
        });

        archive.pipe(output);

        // Write manifest
        const manifest = {
          type: 'openclaw-migration',
          version: '1.0',
          createdAt: now.toISOString(),
          categories: selectedKeys,
          platform: process.platform,
        };
        archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });

        for (const cat of selected) {
          if (cat.key === 'config') {
            // Add root-level config files
            try {
              const rootEntries = fs.readdirSync(OPENCLAW_DIR, { withFileTypes: true });
              for (const entry of rootEntries) {
                if (entry.isFile() && CONFIG_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
                  archive.file(path.join(OPENCLAW_DIR, entry.name), { name: entry.name });
                }
              }
            } catch { /* skip */ }
          } else if (cat.key === 'other') {
            // Add non-categorized dirs and non-config root files
            const accountedDirs = new Set(CATEGORY_DEFS.filter((d) => d.isDir).map((d) => d.subPath));
            try {
              const rootEntries = fs.readdirSync(OPENCLAW_DIR, { withFileTypes: true });
              for (const entry of rootEntries) {
                if (entry.isDirectory() && !accountedDirs.has(entry.name)) {
                  archive.directory(path.join(OPENCLAW_DIR, entry.name), entry.name);
                }
                if (entry.isFile() && !CONFIG_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
                  archive.file(path.join(OPENCLAW_DIR, entry.name), { name: entry.name });
                }
              }
            } catch { /* skip */ }
          } else {
            const def = CATEGORY_DEFS.find((d) => d.key === cat.key);
            if (def && def.isDir) {
              const dirPath = path.join(OPENCLAW_DIR, def.subPath);
              if (fs.existsSync(dirPath)) {
                archive.directory(dirPath, def.subPath);
              }
            }
          }
        }

        archive.finalize();
      });

      if (!sender.isDestroyed()) {
        sender.send('migrate:progress', 100);
      }

      const stat = fs.statSync(outputPath);
      logger.info(`Migration package created: ${outputPath} (${formatSize(stat.size)})`, 'migrate');

      return {
        success: true,
        filePath: outputPath,
        filename: path.basename(outputPath),
        size: stat.size,
      };
    } catch (error) {
      logger.error(`Migrate pack failed: ${(error as Error).message}`, 'migrate');
      try { fs.unlinkSync(outputPath); } catch { /* cleanup */ }
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('migrate:import', async (event) => {
    const sender = event.sender;
    const win = BrowserWindow.fromWebContents(sender);

    const result = await dialog.showOpenDialog(win!, {
      title: 'Select Migration Package',
      filters: [{ name: 'ZIP Archive', extensions: ['zip'] }],
      properties: ['openFile'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: 'User cancelled' };
    }

    const zipPath = result.filePaths[0];
    logger.info(`Importing migration from ${zipPath}`, 'migrate');

    const tmpDir = path.join(os.tmpdir(), `openclaw-import-${Date.now()}`);

    try {
      await extract(zipPath, { dir: tmpDir });

      // Validate manifest
      const manifestPath = path.join(tmpDir, 'manifest.json');
      if (!fs.existsSync(manifestPath)) {
        throw new Error('Invalid migration package: manifest.json not found');
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      if (manifest.type !== 'openclaw-migration') {
        throw new Error('Invalid migration package: unrecognized type');
      }

      // Ensure target dir exists
      if (!fs.existsSync(OPENCLAW_DIR)) {
        fs.mkdirSync(OPENCLAW_DIR, { recursive: true });
      }

      // Copy files from temp to ~/.openclaw/
      let fileCount = 0;
      const restoredCategories: string[] = manifest.categories || [];

      function copyRecursive(src: string, dest: string) {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name === 'manifest.json') continue;
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);

          if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath, { recursive: true });
            }
            copyRecursive(srcPath, destPath);
          } else if (entry.isFile()) {
            fs.copyFileSync(srcPath, destPath);
            fileCount++;
          }
        }
      }

      copyRecursive(tmpDir, OPENCLAW_DIR);

      logger.info(`Migration imported: ${fileCount} files restored`, 'migrate');
      return { success: true, restoredCategories, fileCount };
    } catch (error) {
      logger.error(`Migrate import failed: ${(error as Error).message}`, 'migrate');
      return { success: false, error: (error as Error).message };
    } finally {
      // Cleanup temp dir
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch { /* ignore */ }
    }
  });
}
