import React, { useCallback, useState } from 'react';
import { ImportOutlined, LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useConfigStore } from '../../stores/configStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../i18n/translations';

export const MigrateImport: React.FC = React.memo(() => {
  const { importMigration, isExecuting } = useConfigStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);
  const [importResult, setImportResult] = useState<string | null>(null);

  const handleZoneClick = useCallback(async () => {
    if (isExecuting) return;
    setImportResult(null);
    try {
      await importMigration();
      setImportResult(t('migrate.importSuccess' as any));
      setTimeout(() => setImportResult(null), 4000);
    } catch (error) {
      if (error instanceof Error && error.message === 'User cancelled') return;
      setImportResult(error instanceof Error ? error.message : t('migrate.importError' as any));
      setTimeout(() => setImportResult(null), 4000);
    }
  }, [importMigration, isExecuting, t]);

  return (
    <div className="config-section">
      <div className="config-section-title">{t('config.importMigration')}</div>

      <div
        className={`import-zone${isExecuting ? ' import-zone-disabled' : ''}`}
        onClick={handleZoneClick}
      >
        <div className="import-zone-icon">
          {isExecuting ? <LoadingOutlined /> : <ImportOutlined />}
        </div>
        <div className="import-zone-text">
          {isExecuting ? t('migrate.importing' as any) : t('config.selectFile')}
        </div>
        <div className="import-zone-hint">.zip</div>
      </div>

      {importResult && (
        <div className="import-result">
          <CheckCircleOutlined /> {importResult}
        </div>
      )}
    </div>
  );
});

MigrateImport.displayName = 'MigrateImport';
