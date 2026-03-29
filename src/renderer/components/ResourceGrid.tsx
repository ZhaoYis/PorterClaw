import React, { useMemo } from 'react';
import { ResourceCard } from './ResourceCard';
import { useDashboardStore } from '../stores/dashboardStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useTranslation } from '../i18n/translations';

export const ResourceGrid: React.FC = React.memo(() => {
  const { status, metrics } = useDashboardStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);

  const gatewayStatus = useMemo(() => {
    return status.gateway === 'running' ? 'green' : 'red';
  }, [status.gateway]);

  const gatewayValue = useMemo(() => {
    return status.gateway === 'running' ? t('dashboard.running') : t('dashboard.stopped');
  }, [status.gateway, t]);

  const nodeStatus = useMemo(() => {
    return status.node === 'connected' ? 'green' : 'red';
  }, [status.node]);

  const nodeValue = useMemo(() => {
    return status.node === 'connected' ? t('dashboard.connected') : t('dashboard.disconnected');
  }, [status.node, t]);

  const memoryProgress = useMemo(() => {
    return metrics.memory.percentage;
  }, [metrics.memory.percentage]);

  const memoryStatus = useMemo(() => {
    const percentage = metrics.memory.percentage;
    if (percentage >= 90) return 'red';
    if (percentage >= 80) return 'yellow';
    return 'green';
  }, [metrics.memory.percentage]);

  const memoryProgressLabel = useMemo(() => {
    const used = metrics.memory.used;
    const total = metrics.memory.total;
    if (total >= 1024) {
      return `${(used / 1024).toFixed(1)}GB / ${(total / 1024).toFixed(1)}GB`;
    }
    return `${used}MB / ${total}MB`;
  }, [metrics.memory.used, metrics.memory.total]);

  const skillsStatus = useMemo(() => {
    if (status.overall === 'stopped') return 'red';
    if (metrics.activeSkills === 0) return 'yellow';
    return 'green';
  }, [status.overall, metrics.activeSkills]);

  return (
    <div className="resource-grid">
      <ResourceCard
        title={t('dashboard.gateway')}
        status={gatewayStatus}
        value={gatewayValue}
      />
      <ResourceCard
        title={t('dashboard.node')}
        status={nodeStatus}
        value={nodeValue}
      />
      <ResourceCard
        title={t('dashboard.memory')}
        status={memoryStatus}
        showProgress
        progress={memoryProgress}
        progressLabel={memoryProgressLabel}
      />
      <ResourceCard
        title={t('dashboard.activeSkills')}
        status={skillsStatus}
        largeValue={metrics.activeSkills}
      />
    </div>
  );
});

ResourceGrid.displayName = 'ResourceGrid';
