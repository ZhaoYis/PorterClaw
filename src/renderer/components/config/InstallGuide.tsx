import React, { useEffect, useRef } from 'react';
import {
  CheckCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  ExclamationCircleOutlined,
  BulbOutlined,
  RedoOutlined,
  CodeOutlined,
  LaptopOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Spin } from 'antd';
import { useConfigStore } from '../../stores/configStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../i18n/translations';

export const InstallGuide: React.FC = React.memo(() => {
  const {
    installStatus,
    installPhase,
    installLogs,
    installError,
    envStatus,
    openclawInfo,
    isExecuting,
    autoInstallOpenClaw,
    resetInstallState,
    assessEnvironment,
    startSetupWizard,
  } = useConfigStore();
  
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [installLogs]);

  useEffect(() => {
    if (installStatus !== 'installed' && installStatus !== 'checking') {
      assessEnvironment();
    }
  }, [installStatus, assessEnvironment]);

  const handleInstallClick = () => {
    autoInstallOpenClaw();
  };

  const handleRetry = () => {
    resetInstallState();
    autoInstallOpenClaw();
  };

  // Status indicator logic (Overall Config Component)
  const statusClass =
    installStatus === 'installed'
      ? 'installed'
      : installStatus === 'checking'
      ? 'checking'
      : 'not-installed';

  const dotClass =
    installStatus === 'installed' ? 'green' : installStatus === 'checking' ? 'blue' : 'red';

  const StatusIcon =
    installStatus === 'installed'
      ? CheckCircleOutlined
      : installStatus === 'checking'
      ? LoadingOutlined
      : CloseCircleOutlined;

  const showInstaller = installStatus !== 'installed' && installStatus !== 'checking';

  return (
    <div className="config-section">
      <div className="config-section-title">
        <StatusIcon style={{ fontSize: 16 }} />
        {t('config.installCheck')}
      </div>

      <div className={`install-status ${statusClass}`}>
        <div className={`install-status-dot ${dotClass}`} />
        <span className="install-status-text">
          {installStatus === 'checking'
            ? t('config.checking')
            : installStatus === 'installed'
            ? t('config.installed')
            : t('config.notInstalled')}
        </span>
        {openclawInfo?.version && (
          <span className="install-version">{openclawInfo.version}</span>
        )}
      </div>

      {showInstaller && (
        <>
          {/* Environment Check Module */}
          <div className="env-check-container">
            <div className="env-check-header">
              <span>{t('config.envCheck')}</span>
              {envStatus ? (
                <span className="env-os-badge">
                  <LaptopOutlined style={{ marginRight: 6 }} />
                  {t('config.os')}: {envStatus.os}
                </span>
              ) : (
                <Spin size="small" />
              )}
            </div>
            
            {envStatus?.components.map((comp, idx) => (
              <div key={idx} className="env-component-item">
                <div className="env-component-info">
                  <div className={`env-component-icon ${comp.installed ? 'installed' : 'missing'}`}>
                    {comp.installed ? <CheckCircleOutlined /> : <CodeOutlined />}
                  </div>
                  <div className="env-component-details">
                    <span className="env-component-name">{comp.name}</span>
                    {comp.requiredVersion && (
                      <span className="env-component-req">{t('config.requiredVersion')}: {comp.requiredVersion}</span>
                    )}
                  </div>
                </div>
                <div className="env-component-status">
                  <div className={`env-badge ${comp.installed ? 'installed' : 'missing'}`}>
                    {comp.installed ? t('config.envInstalled' as any) : t('config.envMissing' as any)}
                  </div>
                  {comp.installed && comp.version && (
                    <span className="env-version">{comp.version}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="auto-install-container">
            {/* Main Action Area */}
            <div className="install-main-action">
              <div className="install-phase-text">
                {isExecuting && installPhase !== 'error' && <LoadingOutlined />}
                {installPhase === 'success' && <CheckCircleOutlined style={{ color: '#00C853' }} />}
                {installPhase === 'error' && <CloseCircleOutlined style={{ color: '#ff5f56' }} />}
                <span>{t(`config.phase.${installPhase}` as any)}</span>
              </div>
              
              {installPhase === 'idle' && (
                <button
                  className="gw-btn start"
                  onClick={handleInstallClick}
                  disabled={isExecuting || !envStatus}
                >
                  <PlayCircleOutlined /> {t('config.oneClickInstall')}
                </button>
              )}
              
              {installPhase === 'error' && (
                <button
                  className="gw-btn"
                  onClick={handleRetry}
                  disabled={isExecuting}
                >
                  <RedoOutlined /> {t('config.retry')}
                </button>
              )}
            </div>

            {/* Terminal / Logs View */}
            {(installLogs.length > 0 || isExecuting) && (
              <div className="install-log-terminal">
                {installLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`install-log-line ${log.includes('ERROR') || log.includes('Aborted') ? 'error' : ''}`}
                  >
                    {log}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}

            {/* Error & Solution UI */}
            {installPhase === 'error' && installError && (
              <div className="install-error-box">
                <div className="install-error-title">
                  <ExclamationCircleOutlined /> {t('common.error')}
                </div>
                <div className="install-error-msg">
                  {installError.message}
                </div>
                <div className="install-error-solution">
                  <BulbOutlined style={{ marginRight: 6 }} />
                  <strong>{t('config.solution')}:</strong> {installError.solution}
                </div>
              </div>
            )}

            {installPhase === 'success' && (
              <div className="post-install-action">
                <span className="post-install-action-text">
                  {t('config.setupDesc' as any)}
                </span>
                <button className="gw-btn start" onClick={startSetupWizard}>
                  <SettingOutlined /> {t('config.startConfigure' as any)}
                </button>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
});

InstallGuide.displayName = 'InstallGuide';
