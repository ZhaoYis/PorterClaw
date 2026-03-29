import React, { useEffect, useCallback, useRef } from 'react';
import { Alert, Spin } from 'antd';
import { StatusCard } from '../components/StatusCard';
import { QuickActions } from '../components/QuickActions';
import { ResourceGrid } from '../components/ResourceGrid';
import { useDashboardStore } from '../stores/dashboardStore';

const REFRESH_INTERVAL = 5000;

export const Dashboard: React.FC = () => {
  const {
    refreshStatus,
    refreshMetrics,
    error,
    setError,
    isLoading,
  } = useDashboardStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async () => {
    await Promise.all([
      refreshStatus(),
      refreshMetrics(),
    ]);
  }, [refreshStatus, refreshMetrics]);

  useEffect(() => {
    loadData();

    intervalRef.current = setInterval(() => {
      loadData();
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadData]);

  const handleCloseError = useCallback(() => {
    setError(null);
  }, [setError]);

  return (
    <>
      {error && (
        <Alert
          message={error}
          type="error"
          closable
          onClose={handleCloseError}
          style={{ marginBottom: 16 }}
        />
      )}
      <Spin spinning={isLoading} tip="Loading...">
        <div className="content-wrapper">
          <StatusCard />
          <QuickActions />
          <ResourceGrid />
        </div>
      </Spin>
    </>
  );
};

export default Dashboard;
