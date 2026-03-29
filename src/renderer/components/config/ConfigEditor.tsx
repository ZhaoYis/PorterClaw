import React, { useCallback } from 'react';
import { Switch } from 'antd';
import { useConfigStore } from '../../stores/configStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../i18n/translations';

export const ConfigEditor: React.FC = React.memo(() => {
  const { config, updateConfigField, saveConfig, loadConfig, isExecuting } = useConfigStore();
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

  if (!config) return null;

  return (
    <div className="config-section">
      <div className="config-section-title">{t('config.configEditor')}</div>

      <div className="config-form">
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
          <span className="config-field-label">{t('config.daemon')}</span>
          <Switch
            checked={config.gateway.daemon}
            onChange={(checked) => handleFieldChange('gateway.daemon', checked)}
            size="small"
          />
        </div>
      </div>

      <div className="config-actions">
        <button className="config-btn primary" onClick={handleSave} disabled={isExecuting}>
          {t('config.save')}
        </button>
        <button className="config-btn" onClick={handleReset} disabled={isExecuting}>
          {t('config.reset')}
        </button>
      </div>
    </div>
  );
});

ConfigEditor.displayName = 'ConfigEditor';
