import React, { useCallback } from 'react';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { useConfigStore } from '../../stores/configStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../i18n/translations';

export const GatewayControl: React.FC = React.memo(() => {
  const { gatewayStatus, isExecuting, commandOutput, executeGatewayAction, runDoctor } =
    useConfigStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);

  const handleAction = useCallback(
    (action: 'start' | 'stop' | 'restart' | 'status') => {
      executeGatewayAction(action);
    },
    [executeGatewayAction]
  );

  const statusDotClass =
    gatewayStatus === 'running'
      ? 'running'
      : gatewayStatus === 'stopped'
      ? 'stopped'
      : 'unknown';

  const statusLabel =
    gatewayStatus === 'running'
      ? 'Running'
      : gatewayStatus === 'stopped'
      ? 'Stopped'
      : gatewayStatus === 'starting'
      ? 'Starting...'
      : gatewayStatus === 'stopping'
      ? 'Stopping...'
      : 'Unknown';

  return (
    <div className="config-section">
      <div className="config-section-title">{t('config.gatewayControl')}</div>

      <div className="gateway-actions">
        <button
          className="gw-btn start"
          onClick={() => handleAction('start')}
          disabled={isExecuting}
        >
          <PlayCircleOutlined /> {t('config.start')}
        </button>
        <button
          className="gw-btn stop"
          onClick={() => handleAction('stop')}
          disabled={isExecuting}
        >
          <PauseCircleOutlined /> {t('config.stop')}
        </button>
        <button
          className="gw-btn"
          onClick={() => handleAction('restart')}
          disabled={isExecuting}
        >
          <ReloadOutlined /> {t('config.restart')}
        </button>
        <button
          className="gw-btn"
          onClick={() => handleAction('status')}
          disabled={isExecuting}
        >
          <InfoCircleOutlined /> {t('config.status')}
        </button>
        <button className="gw-btn" onClick={runDoctor} disabled={isExecuting}>
          <MedicineBoxOutlined /> {t('config.runDoctor')}
        </button>
      </div>

      <div className="gateway-status-bar">
        <div className={`status-dot ${statusDotClass}`} />
        <span className="gateway-status-text">
          {t('config.gatewayStatus')}: {statusLabel}
        </span>
      </div>

      {commandOutput && <div className="command-output">{commandOutput}</div>}
    </div>
  );
});

GatewayControl.displayName = 'GatewayControl';
