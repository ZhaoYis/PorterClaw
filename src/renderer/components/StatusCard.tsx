import React, { useMemo } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';

export const StatusCard: React.FC = React.memo(() => {
  const { status, metrics } = useDashboardStore();

  const statusClass = useMemo(() => {
    return status.overall === 'running' ? 'running' : 'stopped';
  }, [status.overall]);

  return (
    <div className="status-card">
      <div className="status-indicator-wrapper">
        <div className={`status-circle ${statusClass}`} />
        <span className="status-label">
          {status.overall === 'running' ? 'Running' : 'Stopped'}
        </span>
      </div>
      <div className="status-meta">
        <div className="meta-item">
          <span className="meta-label">Version</span>
          <span className="meta-value">{metrics.version}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Uptime</span>
          <span className="meta-value">{metrics.uptimeFormatted}</span>
        </div>
      </div>
    </div>
  );
});

StatusCard.displayName = 'StatusCard';
