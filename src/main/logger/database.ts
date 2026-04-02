import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import type { LogLevel } from '@common/types/logs';

const MAX_LOG_ENTRIES = 10000;

let db: Database.Database | null = null;

export interface LogQueryFilter {
  level?: LogLevel | 'all';
  timeRange?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface LogRow {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  source: string | null;
}

function getDb(): Database.Database {
  if (db) return db;

  const dbPath = path.join(app.getPath('userData'), 'porterclaw-logs.db');
  db = new Database(dbPath);

  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      source TEXT
    )
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
  `);

  return db;
}

export function insertLog(level: LogLevel, message: string, source?: string): void {
  const database = getDb();
  const timestamp = new Date().toISOString();

  const stmt = database.prepare(
    'INSERT INTO logs (timestamp, level, message, source) VALUES (?, ?, ?, ?)'
  );
  stmt.run(timestamp, level, message, source ?? null);

  pruneOldLogs(database);
}

function pruneOldLogs(database: Database.Database): void {
  const countRow = database.prepare('SELECT COUNT(*) as cnt FROM logs').get() as { cnt: number };
  if (countRow.cnt > MAX_LOG_ENTRIES) {
    const excess = countRow.cnt - MAX_LOG_ENTRIES;
    database.prepare(
      'DELETE FROM logs WHERE id IN (SELECT id FROM logs ORDER BY id ASC LIMIT ?)'
    ).run(excess);
  }
}

function buildTimeRangeCutoff(timeRange: string): string | null {
  const now = Date.now();
  const ranges: Record<string, number> = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
  };
  const ms = ranges[timeRange];
  if (!ms) return null;
  return new Date(now - ms).toISOString();
}

export function queryLogs(filter?: LogQueryFilter): LogRow[] {
  const database = getDb();
  const conditions: string[] = [];
  const params: any[] = [];

  if (filter?.level && filter.level !== 'all') {
    conditions.push('level = ?');
    params.push(filter.level);
  }

  if (filter?.timeRange && filter.timeRange !== 'all') {
    const cutoff = buildTimeRangeCutoff(filter.timeRange);
    if (cutoff) {
      conditions.push('timestamp >= ?');
      params.push(cutoff);
    }
  }

  if (filter?.search?.trim()) {
    conditions.push('(message LIKE ? OR source LIKE ?)');
    const pattern = `%${filter.search.trim()}%`;
    params.push(pattern, pattern);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = filter?.limit ?? 1000;
  const offset = filter?.offset ?? 0;

  const sql = `SELECT id, timestamp, level, message, source FROM logs ${where} ORDER BY id DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  return database.prepare(sql).all(...params) as LogRow[];
}

export function clearLogs(): void {
  const database = getDb();
  database.exec('DELETE FROM logs');
  database.exec('VACUUM');
}

export function getLogCount(filter?: LogQueryFilter): number {
  const database = getDb();
  const conditions: string[] = [];
  const params: any[] = [];

  if (filter?.level && filter.level !== 'all') {
    conditions.push('level = ?');
    params.push(filter.level);
  }

  if (filter?.timeRange && filter.timeRange !== 'all') {
    const cutoff = buildTimeRangeCutoff(filter.timeRange);
    if (cutoff) {
      conditions.push('timestamp >= ?');
      params.push(cutoff);
    }
  }

  if (filter?.search?.trim()) {
    conditions.push('(message LIKE ? OR source LIKE ?)');
    const pattern = `%${filter.search.trim()}%`;
    params.push(pattern, pattern);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const row = database.prepare(`SELECT COUNT(*) as cnt FROM logs ${where}`).get(...params) as { cnt: number };
  return row.cnt;
}

export function exportLogsAsText(filter?: LogQueryFilter): string {
  const rows = queryLogs({ ...filter, limit: 50000, offset: 0 });
  return rows
    .reverse()
    .map(
      (r) =>
        `[${r.timestamp}] [${r.level.toUpperCase()}] ${r.source ? `[${r.source}] ` : ''}${r.message}`
    )
    .join('\n');
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
