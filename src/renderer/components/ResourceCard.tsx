import React, { useMemo } from 'react';

interface ResourceCardProps {
  title: string;
  status?: 'green' | 'red' | 'yellow';
  value?: string;
  largeValue?: number;
  showProgress?: boolean;
  progress?: number;
  progressLabel?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = React.memo(({
  title,
  status = 'green',
  value,
  largeValue,
  showProgress = false,
  progress = 0,
  progressLabel,
}) => {
  const dotClass = useMemo(() => {
    return `resource-dot ${status}`;
  }, [status]);

  return (
    <div className="resource-card">
      <div className="resource-header">
        <div className={dotClass} />
        <span className="resource-title">{title}</span>
      </div>
      {value && <span className="resource-value">{value}</span>}
      {largeValue !== undefined && (
        <span className="resource-value large">{largeValue}</span>
      )}
      {showProgress && (
        <>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progressLabel && (
            <span className="progress-label">{progressLabel}</span>
          )}
        </>
      )}
    </div>
  );
});

ResourceCard.displayName = 'ResourceCard';
