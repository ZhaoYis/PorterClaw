import React, { useCallback, useState } from 'react';
import { CheckCircleOutlined, LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useConfigStore } from '../../stores/configStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../i18n/translations';
import { getInstallCommand } from '../../services/configService';

export const InstallGuide: React.FC = React.memo(() => {
  const { installStatus, openclawInfo, checkInstallation, isExecuting } = useConfigStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);
  const [copied, setCopied] = useState(false);

  const installCommand = getInstallCommand();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = installCommand;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [installCommand]);

  const handleCheck = useCallback(() => {
    checkInstallation();
  }, [checkInstallation]);

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

      {installStatus !== 'installed' && installStatus !== 'checking' && (
        <div className="install-steps">
          <div className="install-step">
            <div className="install-step-header">
              <div className="install-step-number">1</div>
              <span className="install-step-title">{t('config.installStep1')}</span>
            </div>
            <div className="install-step-desc">{t('config.installStep1Desc')}</div>
            <div className="install-command">
              <code>{installCommand}</code>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? t('config.copied') : t('config.copyCommand')}
              </button>
            </div>
          </div>

          <div className="install-step">
            <div className="install-step-header">
              <div className="install-step-number">2</div>
              <span className="install-step-title">{t('config.installStep2')}</span>
            </div>
            <div className="install-step-desc">{t('config.installStep2Desc')}</div>
            <div className="install-step-actions">
              <button className="gw-btn" onClick={handleCheck} disabled={isExecuting}>
                {t('config.checkInstall')}
              </button>
            </div>
          </div>

          <div className="install-step">
            <div className="install-step-header">
              <div className="install-step-number">3</div>
              <span className="install-step-title">{t('config.installStep3')}</span>
            </div>
            <div className="install-step-desc">{t('config.installStep3Desc')}</div>
            <div className="install-step-actions">
              <button className="gw-btn start" onClick={handleCheck} disabled={isExecuting}>
                {t('config.testService')}
              </button>
            </div>
          </div>
        </div>
      )}

      {installStatus === 'installed' && (
        <div style={{ marginTop: 12 }}>
          <button className="gw-btn" onClick={handleCheck} disabled={isExecuting}>
            {t('config.checkInstall')}
          </button>
        </div>
      )}
    </div>
  );
});

InstallGuide.displayName = 'InstallGuide';
