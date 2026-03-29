import React, { useEffect, useCallback, useRef } from 'react';
import { Switch } from 'antd';
import {
  ReloadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useLogsStore } from '../stores/logsStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useTranslation } from '../i18n/translations';
import type { LogLevel, LogTimeRange } from '@common/types/logs';
import '../styles/logs.css';

const levelTabs: Array<{ key: 'all' | LogLevel; labelKey: string; className?: string }> = [
  { key: 'all', labelKey: 'logs.all' },
  { key: 'error', labelKey: 'logs.error', className: 'error' },
  { key: 'warn', labelKey: 'logs.warn', className: 'warn' },
  { key: 'info', labelKey: 'logs.info' },
  { key: 'debug', labelKey: 'logs.debug', className: 'debug' },
];

const timeRanges: Array<{ key: LogTimeRange; labelKey: string }> = [
  { key: '1h', labelKey: 'logs.1h' },
  { key: '6h', labelKey: 'logs.6h' },
  { key: '24h', labelKey: 'logs.24h' },
  { key: '7d', labelKey: 'logs.7d' },
  { key: 'all', labelKey: 'logs.allTime' },
];

const Logs: React.FC = () => {
  const {
    filteredEntries,
    filter,
    isLoading,
    autoScroll,
    loadLogs,
    setFilter,
    clearLogs,
    exportLogs,
    toggleAutoScroll,
  } = useLogsStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    if (autoScroll && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [filteredEntries, autoScroll]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter({ search: e.target.value });
    },
    [setFilter]
  );

  const formatTimestamp = useCallback((ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return ts;
    }
  }, []);

  return (
    <div className="logs-page">
      <h2>{t('logs.title')}</h2>

      {/* Toolbar */}
      <div className="logs-toolbar">
        <div className="logs-level-tabs">
          {levelTabs.map((tab) => (
            <button
              key={tab.key}
              className={`logs-level-tab ${filter.level === tab.key ? `active ${tab.className || ''}` : ''}`}
              onClick={() => setFilter({ level: tab.key })}
            >
              {t(tab.labelKey as any)}
            </button>
          ))}
        </div>

        <div className="logs-time-selector">
          {timeRanges.map((range) => (
            <button
              key={range.key}
              className={`logs-time-btn ${filter.timeRange === range.key ? 'active' : ''}`}
              onClick={() => setFilter({ timeRange: range.key })}
            >
              {t(range.labelKey as any)}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="logs-search"
          placeholder={t('logs.search')}
          value={filter.search}
          onChange={handleSearch}
        />

        <div className="logs-actions">
          <button className="logs-action-btn" onClick={loadLogs} disabled={isLoading}>
            <ReloadOutlined /> {t('logs.refresh')}
          </button>
          <button className="logs-action-btn" onClick={exportLogs}>
            <DownloadOutlined /> {t('logs.export')}
          </button>
          <button className="logs-action-btn danger" onClick={clearLogs}>
            <DeleteOutlined /> {t('logs.clear')}
          </button>
        </div>
      </div>

      {/* Auto-scroll + count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="logs-auto-scroll">
          <Switch size="small" checked={autoScroll} onChange={toggleAutoScroll} />
          {t('logs.autoScroll')}
        </div>
        <span className="logs-count">{filteredEntries.length} entries</span>
      </div>

      {/* Log List */}
      <div className="logs-list" ref={listRef}>
        {filteredEntries.length === 0 ? (
          <div className="logs-empty">
            <FileTextOutlined className="logs-empty-icon" />
            <span>{t('logs.noLogs')}</span>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="log-entry">
              <span className="log-timestamp">{formatTimestamp(entry.timestamp)}</span>
              <span className={`log-level ${entry.level}`}>{entry.level}</span>
              <span className="log-message">{entry.message}</span>
              {entry.source && <span className="log-source">{entry.source}</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Logs;
