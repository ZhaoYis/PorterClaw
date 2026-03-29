import React, { useCallback, useState } from 'react';
import {
  PauseOutlined,
  ReloadOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  CaretRightOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Modal, message } from 'antd';
import { useDashboardStore } from '../stores/dashboardStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useTranslation } from '../i18n/translations';

export const QuickActions: React.FC = React.memo(() => {
  const { stopService, restartService, openConfig, isLoading, status } = useDashboardStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, msgContextHolder] = message.useMessage();
  const [actionInProgress, setActionInProgress] = useState<'stop' | 'restart' | null>(null);

  const isRunning = status.overall === 'running' || status.gateway === 'running';
  const isStopped = status.overall === 'stopped' && status.gateway === 'stopped';

  const handleStop = useCallback(() => {
    if (isStopped) {
      messageApi.warning({
        content: language === 'zh' ? '服务当前未运行，无需停止' : 'Service is not running — nothing to stop',
        icon: <WarningOutlined />,
      });
      return;
    }

    modal.confirm({
      title: language === 'zh' ? '确认停止服务' : 'Confirm Stop Service',
      content: language === 'zh'
        ? '停止服务后，所有连接的客户端将断开。确定要停止吗？'
        : 'Stopping the service will disconnect all clients. Are you sure?',
      icon: <ExclamationCircleOutlined />,
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      okButtonProps: { danger: true },
      onOk: async () => {
        setActionInProgress('stop');
        try {
          await stopService();
          messageApi.success({
            content: language === 'zh' ? '服务已停止' : 'Service stopped successfully',
            icon: <CheckCircleOutlined />,
          });
        } catch {
          messageApi.error({
            content: language === 'zh' ? '停止服务失败' : 'Failed to stop service',
          });
        } finally {
          setActionInProgress(null);
        }
      },
    });
  }, [modal, stopService, isStopped, messageApi, language, t]);

  const handleRestart = useCallback(() => {
    const title = isRunning
      ? (language === 'zh' ? '确认重启服务' : 'Confirm Restart Service')
      : (language === 'zh' ? '确认启动服务' : 'Confirm Start Service');

    const content = isRunning
      ? (language === 'zh' ? '重启服务期间会有短暂的服务中断。确定要重启吗？' : 'Restarting will cause a brief service interruption. Continue?')
      : (language === 'zh' ? '服务当前未运行，将尝试启动服务。' : 'Service is currently stopped. Attempt to start?');

    modal.confirm({
      title,
      content,
      icon: <ExclamationCircleOutlined />,
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        setActionInProgress('restart');
        try {
          await restartService();
          messageApi.success({
            content: isRunning
              ? (language === 'zh' ? '服务已重启' : 'Service restarted successfully')
              : (language === 'zh' ? '服务已启动' : 'Service started successfully'),
            icon: <CheckCircleOutlined />,
          });
        } catch {
          messageApi.error({
            content: language === 'zh' ? '操作失败' : 'Operation failed',
          });
        } finally {
          setActionInProgress(null);
        }
      },
    });
  }, [modal, restartService, isRunning, messageApi, language, t]);

  const handleConfig = useCallback(() => {
    openConfig();
  }, [openConfig]);

  return (
    <>
      {msgContextHolder}
      <div className="quick-actions">
        {/* Stop Button — only active when service is running */}
        <button
          className={`action-btn ${isStopped ? 'disabled' : ''}`}
          onClick={handleStop}
          disabled={isLoading || actionInProgress !== null}
        >
          <span className="action-icon">
            {actionInProgress === 'stop' ? <LoadingOutlined spin /> : <PauseOutlined />}
          </span>
          <span className="action-label">{t('dashboard.stop')}</span>
          {isStopped && <span className="action-hint">{language === 'zh' ? '已停止' : 'Inactive'}</span>}
        </button>

        {/* Restart/Start Button — primary, always available */}
        <button
          className="action-btn primary"
          onClick={handleRestart}
          disabled={isLoading || actionInProgress !== null}
        >
          <span className="action-icon">
            {actionInProgress === 'restart' ? (
              <LoadingOutlined spin />
            ) : isRunning ? (
              <ReloadOutlined />
            ) : (
              <CaretRightOutlined />
            )}
          </span>
          <span className="action-label">
            {isRunning ? t('dashboard.restart') : (language === 'zh' ? '启动' : 'Start')}
          </span>
        </button>

        {/* Config Button — navigates to Config page */}
        <button
          className="action-btn"
          onClick={handleConfig}
          disabled={isLoading || actionInProgress !== null}
        >
          <span className="action-icon">
            <SettingOutlined />
          </span>
          <span className="action-label">{t('dashboard.config')}</span>
        </button>
      </div>
      {contextHolder}
    </>
  );
});

QuickActions.displayName = 'QuickActions';
