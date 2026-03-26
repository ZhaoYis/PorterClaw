import React, { useEffect, useCallback, useRef } from 'react';
import { ConfigProvider, theme, Alert, Spin } from 'antd';
import { Navbar } from '../components/Navbar';
import { StatusCard } from '../components/StatusCard';
import { QuickActions } from '../components/QuickActions';
import { ResourceGrid } from '../components/ResourceGrid';
import { useDashboardStore } from '../stores/dashboardStore';
import '../styles/dashboard.css';

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
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#0066FF',
          colorSuccess: '#00C853',
          colorBgBase: '#1E1E1E',
          colorBgContainer: '#252526',
          colorBorder: '#333',
          borderRadius: 8,
        },
      }}
    >
      <div className="app-window">
        <Navbar />
        <main className="main-content">
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
        </main>
      </div>
    </ConfigProvider>
  );
};

export default Dashboard;
