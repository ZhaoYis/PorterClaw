import type { LogEntry, LogFilter } from '@common/types/logs';
import { isElectronEnvironment } from './monitoringService';

function getGatewayBase(): string {
  try {
    const stored = localStorage.getItem('porterclaw_settings');
    if (stored) {
      const settings = JSON.parse(stored);
      const host = settings.gatewayHost || 'localhost';
      const port = settings.gatewayPort || 18789;
      return `http://${host}:${port}`;
    }
  } catch { /* ignore */ }
  return 'http://localhost:18789';
}

export async function fetchLogs(filter?: Partial<LogFilter> & { limit?: number; offset?: number }): Promise<LogEntry[]> {
  if (isElectronEnvironment()) {
    return window.electron.logs.queryLogs(filter);
  }

  // Web mode: try Gateway API
  const base = getGatewayBase();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${base}/api/v1/logs`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.logs)) {
        return data.logs.map((log: any, idx: number) => ({
          id: log.id || `log-${idx}`,
          timestamp: log.timestamp || new Date().toISOString(),
          level: log.level || 'info',
          message: log.message || '',
          source: log.source,
        }));
      }
    }
  } catch {
    // Gateway not available
  }

  return [];
}

export async function clearLogsRemote(): Promise<void> {
  if (isElectronEnvironment()) {
    return window.electron.logs.clearLogs();
  }
}

export async function exportLogsRemote(filter?: Partial<LogFilter>): Promise<string> {
  if (isElectronEnvironment()) {
    return window.electron.logs.exportLogs(filter);
  }
  return '';
}

export function downloadLogs(entries: LogEntry[]): void {
  const content = entries
    .map(
      (e) =>
        `[${e.timestamp}] [${e.level.toUpperCase()}] ${e.source ? `[${e.source}] ` : ''}${e.message}`
    )
    .join('\n');

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `openclaw-logs-${new Date().toISOString().slice(0, 10)}.log`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
