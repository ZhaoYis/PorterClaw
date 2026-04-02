import React, { useCallback } from 'react';
import { Switch } from 'antd';
import {
  RocketOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useConfigStore } from '../../stores/configStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../i18n/translations';
import type { ProviderType, LogLevel } from '@common/types/config';

const PROVIDER_OPTIONS: ProviderType[] = ['openai', 'anthropic', 'azure', 'local', 'custom'];
const LOG_LEVEL_OPTIONS: LogLevel[] = ['debug', 'info', 'warn', 'error'];

export const ConfigEditor: React.FC = React.memo(() => {
  const { config, configDirty, updateConfigField, saveConfig, loadConfig, isExecuting } = useConfigStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);

  const handleFieldChange = useCallback(
    (key: string, value: unknown) => {
      updateConfigField(key, value);
    },
    [updateConfigField]
  );

  const handleSave = useCallback(() => {
    saveConfig();
  }, [saveConfig]);

  const handleReset = useCallback(() => {
    loadConfig();
  }, [loadConfig]);

  const providerLabels: Record<ProviderType, string> = {
    openai: t('config.providerOpenai' as any),
    anthropic: t('config.providerAnthropic' as any),
    azure: t('config.providerAzure' as any),
    local: t('config.providerLocal' as any),
    custom: t('config.providerCustom' as any),
  };

  if (!config) return null;

  return (
    <div className="config-section">
      <div className="config-section-title">{t('config.configEditor')}</div>

      <div className="config-form">
        {/* Gateway */}
        <div className="config-group-title">
          <RocketOutlined /> {t('config.sectionGateway' as any)}
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.port')}</span>
          <input
            type="number"
            className="config-field-input"
            value={config.gateway.port}
            onChange={(e) =>
              handleFieldChange('gateway.port', parseInt(e.target.value, 10) || 18789)
            }
            min={1}
            max={65535}
          />
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.host')}</span>
          <input
            type="text"
            className="config-field-input"
            value={config.gateway.host}
            onChange={(e) => handleFieldChange('gateway.host', e.target.value)}
          />
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.authToken' as any)}</span>
          <input
            type="password"
            className="config-field-input"
            value={config.gateway.authToken || ''}
            onChange={(e) => handleFieldChange('gateway.authToken', e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.daemon')}</span>
          <Switch
            checked={config.gateway.daemon}
            onChange={(checked) => handleFieldChange('gateway.daemon', checked)}
            size="small"
          />
        </div>

        {/* Provider */}
        <div className="config-group-title">
          <ApiOutlined /> {t('config.sectionProvider' as any)}
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.providerType' as any)}</span>
          <select
            className="config-field-select"
            value={config.provider.type}
            onChange={(e) => handleFieldChange('provider.type', e.target.value)}
          >
            {PROVIDER_OPTIONS.map((p) => (
              <option key={p} value={p}>{providerLabels[p]}</option>
            ))}
          </select>
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.apiKey' as any)}</span>
          <input
            type="password"
            className="config-field-input"
            value={config.provider.apiKey}
            onChange={(e) => handleFieldChange('provider.apiKey', e.target.value)}
            placeholder="sk-..."
          />
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.baseUrl' as any)}</span>
          <input
            type="text"
            className="config-field-input"
            value={config.provider.baseUrl}
            onChange={(e) => handleFieldChange('provider.baseUrl', e.target.value)}
          />
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.model' as any)}</span>
          <input
            type="text"
            className="config-field-input"
            value={config.provider.model}
            onChange={(e) => handleFieldChange('provider.model', e.target.value)}
            placeholder="gpt-4"
          />
        </div>

        {/* Skills */}
        <div className="config-group-title">
          <ThunderboltOutlined /> {t('config.sectionSkills' as any)}
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.skillsDir' as any)}</span>
          <input
            type="text"
            className="config-field-input"
            value={config.skills.directory}
            onChange={(e) => handleFieldChange('skills.directory', e.target.value)}
          />
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.autoLoadSkills' as any)}</span>
          <Switch
            checked={config.skills.autoLoad}
            onChange={(checked) => handleFieldChange('skills.autoLoad', checked)}
            size="small"
          />
        </div>

        {/* Logging */}
        <div className="config-group-title">
          <FileTextOutlined /> {t('config.sectionLogging' as any)}
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.logLevel' as any)}</span>
          <select
            className="config-field-select"
            value={config.logging.level}
            onChange={(e) => handleFieldChange('logging.level', e.target.value)}
          >
            {LOG_LEVEL_OPTIONS.map((l) => (
              <option key={l} value={l}>{l.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div className="config-field">
          <span className="config-field-label">{t('config.logFile' as any)}</span>
          <input
            type="text"
            className="config-field-input"
            value={config.logging.file}
            onChange={(e) => handleFieldChange('logging.file', e.target.value)}
          />
        </div>
      </div>

      <div className="config-actions">
        <button className="config-btn primary" onClick={handleSave} disabled={isExecuting}>
          {t('config.save')} {configDirty ? '*' : ''}
        </button>
        <button className="config-btn" onClick={handleReset} disabled={isExecuting}>
          {t('config.reset')}
        </button>
      </div>
    </div>
  );
});

ConfigEditor.displayName = 'ConfigEditor';
