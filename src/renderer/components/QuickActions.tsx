import React, { useCallback } from 'react';
import { PauseOutlined, ReloadOutlined, SettingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useDashboardStore } from '../stores/dashboardStore';

export const QuickActions: React.FC = React.memo(() => {
  const { stopService, restartService, openConfig, isLoading } = useDashboardStore();
  const [modal, contextHolder] = Modal.useModal();

  const handleStop = useCallback(() => {
    modal.confirm({
      title: 'Confirm Stop',
      content: 'Are you sure you want to stop the service?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        await stopService();
      },
    });
  }, [modal, stopService]);

  const handleRestart = useCallback(async () => {
    await restartService();
  }, [restartService]);

  const handleConfig = useCallback(() => {
    openConfig();
  }, [openConfig]);

  return (
    <>
      <div className="quick-actions">
        <button
          className="action-btn"
          onClick={handleStop}
          disabled={isLoading}
        >
          <span className="action-icon">
            <PauseOutlined />
          </span>
          <span className="action-label">Stop</span>
        </button>
        <button
          className="action-btn primary"
          onClick={handleRestart}
          disabled={isLoading}
        >
          <span className="action-icon">
            <ReloadOutlined />
          </span>
          <span className="action-label">Restart</span>
        </button>
        <button
          className="action-btn"
          onClick={handleConfig}
          disabled={isLoading}
        >
          <span className="action-icon">
            <SettingOutlined />
          </span>
          <span className="action-label">Config</span>
        </button>
      </div>
      {contextHolder}
    </>
  );
});

QuickActions.displayName = 'QuickActions';
