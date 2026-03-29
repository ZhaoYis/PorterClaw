import React, { useMemo } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useTranslation } from '../i18n/translations';

export const StatusCard: React.FC = React.memo(() => {
  const { status, metrics } = useDashboardStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);

  const statusClass = useMemo(() => {
    return status.overall === 'running' ? 'running' : 'stopped';
  }, [status.overall]);

  const statusText = useMemo(() => {
    return status.overall === 'running' ? t('dashboard.running') : t('dashboard.stopped');
  }, [status.overall, t]);

  return (
    <div className="status-card">
      <div className="status-indicator-wrapper">
        <div className={`status-circle ${statusClass}`} />
        <span className="status-label">{statusText}</span>
      </div>
      <div className="status-meta">
        <div className="meta-item">
          <span className="meta-label">{t('dashboard.version')}</span>
          <span className="meta-value">{metrics.version}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">{t('dashboard.uptime')}</span>
          <span className="meta-value">{metrics.uptimeFormatted}</span>
        </div>
      </div>
    </div>
  );
});

StatusCard.displayName = 'StatusCard';
