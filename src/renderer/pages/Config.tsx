import React, { useEffect, useCallback } from 'react';
import { Alert } from 'antd';
import { useConfigStore } from '../stores/configStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useTranslation } from '../i18n/translations';
import { InstallGuide } from '../components/config/InstallGuide';
import { GatewayControl } from '../components/config/GatewayControl';
import { ConfigEditor } from '../components/config/ConfigEditor';
import { MigrateImport } from '../components/config/MigrateImport';
import '../styles/config.css';

const Config: React.FC = () => {
  const { error, setError, checkInstallation, loadConfig } = useConfigStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);

  useEffect(() => {
    checkInstallation();
    loadConfig();
  }, [checkInstallation, loadConfig]);

  const handleCloseError = useCallback(() => {
    setError(null);
  }, [setError]);

  return (
    <div className="config-page">
      <h2>{t('config.title')}</h2>

      {error && (
        <Alert
          message={error}
          type="error"
          closable
          onClose={handleCloseError}
          style={{ marginBottom: 0 }}
        />
      )}

      <InstallGuide />
      <GatewayControl />
      <ConfigEditor />
      <MigrateImport />
    </div>
  );
};

export default Config;
