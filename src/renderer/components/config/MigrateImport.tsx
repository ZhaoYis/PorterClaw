import React, { useCallback, useRef } from 'react';
import { ImportOutlined } from '@ant-design/icons';
import { useConfigStore } from '../../stores/configStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../i18n/translations';

export const MigrateImport: React.FC = React.memo(() => {
  const { importMigration, isExecuting } = useConfigStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleZoneClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        await importMigration(text);
      } catch (error) {
        console.error('Failed to read file:', error);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [importMigration]
  );

  return (
    <div className="config-section">
      <div className="config-section-title">{t('config.importMigration')}</div>

      <div className="import-zone" onClick={handleZoneClick}>
        <div className="import-zone-icon">
          <ImportOutlined />
        </div>
        <div className="import-zone-text">{t('config.selectFile')}</div>
        <div className="import-zone-hint">.json / .zip</div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.zip"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={isExecuting}
      />
    </div>
  );
});

MigrateImport.displayName = 'MigrateImport';
