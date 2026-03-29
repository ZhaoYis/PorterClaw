/**
 * Logs Service
 * Provides log data from Gateway API or simulated entries
 */

import type { LogEntry, LogLevel } from '@common/types/logs';

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

/**
 * Generate simulated log entries for demo
 */
function generateSimulatedLogs(): LogEntry[] {
  const levels: LogLevel[] = ['info', 'info', 'info', 'warn', 'error', 'debug', 'info', 'debug'];
  const messages = [
    'Gateway service started on port 18789',
    'Incoming connection from 192.168.1.100',
    'Processing skill request: web-search',
    'Memory usage at 45% (2.3GB / 5.1GB)',
    'WebSocket connection established',
    'Health check passed — all subsystems operational',
    'Rate limit applied: 100 req/min for client abc123',
    'Warning: Slow response time detected (> 2000ms)',
    'Error: Failed to connect to upstream model provider',
    'Debug: Cache hit ratio: 87.3%',
    'Node node-01 connected successfully',
    'Skill "code-review" completed in 1.2s',
    'Configuration reloaded from ~/.openclaw/openclaw.json',
    'Error: Authentication token expired for client xyz789',
    'Warning: Disk usage above 80%',
    'Debug: GC pause: 12ms',
    'New skill registered: data-analysis v2.1.0',
    'Gateway port binding successful',
    'TLS certificate renewed successfully',
    'Warning: Connection pool approaching limit (95/100)',
  ];

  const now = Date.now();
  const entries: LogEntry[] = [];

  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now - Math.random() * 24 * 60 * 60 * 1000).toISOString();
    const level = levels[Math.floor(Math.random() * levels.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];

    entries.push({
      id: `log-${i}-${Date.now()}`,
      timestamp,
      level,
      message,
      source: Math.random() > 0.5 ? 'gateway' : 'node',
    });
  }

  // Sort by timestamp descending (newest first)
  entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return entries;
}

/**
 * Fetch logs from Gateway API
 */
export async function fetchLogs(): Promise<LogEntry[]> {
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

  // Fallback: simulated logs
  return generateSimulatedLogs();
}

/**
 * Export logs as downloadable file
 */
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
