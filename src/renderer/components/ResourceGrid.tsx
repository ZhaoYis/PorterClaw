import React, { useMemo } from 'react';
import { ResourceCard } from './ResourceCard';
import { useDashboardStore } from '../stores/dashboardStore';

export const ResourceGrid: React.FC = React.memo(() => {
  const { status, metrics } = useDashboardStore();

  const gatewayStatus = useMemo(() => {
    return status.gateway === 'running' ? 'green' : 'red';
  }, [status.gateway]);

  const nodeStatus = useMemo(() => {
    return status.node === 'connected' ? 'green' : 'red';
  }, [status.node]);

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
    return `${metrics.memory.used}MB / ${metrics.memory.total}MB`;
  }, [metrics.memory.used, metrics.memory.total]);

  return (
    <div className="resource-grid">
      <ResourceCard
        title="Gateway"
        status={gatewayStatus}
        value={status.gateway === 'running' ? 'Running' : 'Stopped'}
      />
      <ResourceCard
        title="Node"
        status={nodeStatus}
        value={status.node === 'connected' ? 'Connected' : 'Disconnected'}
      />
      <ResourceCard
        title="Memory"
        status={memoryStatus}
        showProgress
        progress={memoryProgress}
        progressLabel={memoryProgressLabel}
      />
      <ResourceCard
        title="Active Skills"
        status="green"
        largeValue={metrics.activeSkills}
      />
    </div>
  );
});

ResourceGrid.displayName = 'ResourceGrid';
