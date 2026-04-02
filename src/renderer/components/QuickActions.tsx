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
  const {
    startService,
    stopService,
    restartService,
    openConfig,
    isLoading,
    status,
    clearEnvCheck,
  } = useDashboardStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, msgContextHolder] = message.useMessage();
  const [actionInProgress, setActionInProgress] = useState<'stop' | 'start' | 'restart' | null>(null);

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

  const handleStart = useCallback(() => {
    modal.confirm({
      title: language === 'zh' ? '确认启动服务' : 'Confirm Start Service',
      content: language === 'zh'
        ? '将检查运行环境并尝试启动 OpenClaw Gateway 服务。'
        : 'Environment will be checked and OpenClaw Gateway will be started.',
      icon: <ExclamationCircleOutlined />,
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        setActionInProgress('start');
        try {
          await startService();
          const store = useDashboardStore.getState();
          if (store.envCheck && !store.envCheck.ok) {
            const missing = store.envCheck.components
              .filter((c) => !c.installed)
              .map((c) => c.name)
              .join(', ');
            Modal.error({
              title: language === 'zh' ? '环境检查未通过' : 'Environment Check Failed',
              content: (
                <div>
                  <p>
                    {language === 'zh'
                      ? `以下组件未安装：${missing}`
                      : `Missing components: ${missing}`}
                  </p>
                  <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                    {store.envCheck.components.map((c) => (
                      <li key={c.name} style={{ color: c.installed ? '#52c41a' : '#ff4d4f' }}>
                        {c.name}: {c.installed
                          ? `${language === 'zh' ? '已安装' : 'Installed'} (${c.version || 'unknown'})`
                          : (language === 'zh' ? '未安装' : 'Not Installed')}
                      </li>
                    ))}
                  </ul>
                  <p style={{ marginTop: 12, color: '#faad14' }}>
                    {language === 'zh'
                      ? '请前往「配置」页面安装缺失的组件。'
                      : 'Please go to Config page to install missing components.'}
                  </p>
                </div>
              ),
              okText: language === 'zh' ? '前往配置' : 'Go to Config',
              onOk: () => {
                clearEnvCheck();
                openConfig();
              },
            });
          } else {
            messageApi.success({
              content: language === 'zh' ? '服务已启动' : 'Service started successfully',
              icon: <CheckCircleOutlined />,
            });
          }
        } catch {
          messageApi.error({
            content: language === 'zh' ? '启动服务失败' : 'Failed to start service',
          });
        } finally {
          setActionInProgress(null);
        }
      },
    });
  }, [modal, startService, messageApi, language, t, clearEnvCheck, openConfig]);

  const handleRestart = useCallback(() => {
    modal.confirm({
      title: language === 'zh' ? '确认重启服务' : 'Confirm Restart Service',
      content: language === 'zh'
        ? '重启服务期间会有短暂的服务中断，将先检查运行环境。确定要重启吗？'
        : 'Restarting will cause a brief interruption. Environment will be checked first. Continue?',
      icon: <ExclamationCircleOutlined />,
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        setActionInProgress('restart');
        try {
          await restartService();
          const store = useDashboardStore.getState();
          if (store.envCheck && !store.envCheck.ok) {
            const missing = store.envCheck.components
              .filter((c) => !c.installed)
              .map((c) => c.name)
              .join(', ');
            Modal.error({
              title: language === 'zh' ? '环境检查未通过' : 'Environment Check Failed',
              content: (
                <div>
                  <p>
                    {language === 'zh'
                      ? `以下组件未安装：${missing}`
                      : `Missing components: ${missing}`}
                  </p>
                  <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                    {store.envCheck.components.map((c) => (
                      <li key={c.name} style={{ color: c.installed ? '#52c41a' : '#ff4d4f' }}>
                        {c.name}: {c.installed
                          ? `${language === 'zh' ? '已安装' : 'Installed'} (${c.version || 'unknown'})`
                          : (language === 'zh' ? '未安装' : 'Not Installed')}
                      </li>
                    ))}
                  </ul>
                  <p style={{ marginTop: 12, color: '#faad14' }}>
                    {language === 'zh'
                      ? '请前往「配置」页面安装缺失的组件。'
                      : 'Please go to Config page to install missing components.'}
                  </p>
                </div>
              ),
              okText: language === 'zh' ? '前往配置' : 'Go to Config',
              onOk: () => {
                clearEnvCheck();
                openConfig();
              },
            });
          } else {
            messageApi.success({
              content: language === 'zh' ? '服务已重启' : 'Service restarted successfully',
              icon: <CheckCircleOutlined />,
            });
          }
        } catch {
          messageApi.error({
            content: language === 'zh' ? '重启服务失败' : 'Failed to restart service',
          });
        } finally {
          setActionInProgress(null);
        }
      },
    });
  }, [modal, restartService, messageApi, language, t, clearEnvCheck, openConfig]);

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

        {/* Start / Restart Button */}
        {isStopped ? (
          <button
            className="action-btn primary"
            onClick={handleStart}
            disabled={isLoading || actionInProgress !== null}
          >
            <span className="action-icon">
              {actionInProgress === 'start' ? <LoadingOutlined spin /> : <CaretRightOutlined />}
            </span>
            <span className="action-label">{language === 'zh' ? '启动' : 'Start'}</span>
          </button>
        ) : (
          <button
            className="action-btn primary"
            onClick={handleRestart}
            disabled={isLoading || actionInProgress !== null}
          >
            <span className="action-icon">
              {actionInProgress === 'restart' ? <LoadingOutlined spin /> : <ReloadOutlined />}
            </span>
            <span className="action-label">{t('dashboard.restart')}</span>
          </button>
        )}

        {/* Config Button */}
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
