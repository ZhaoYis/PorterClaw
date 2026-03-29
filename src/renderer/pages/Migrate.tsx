import React, { useEffect, useCallback } from 'react';
import { Switch } from 'antd';
import {
  FileZipOutlined,
  SettingOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useMigrateStore } from '../stores/migrateStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useTranslation } from '../i18n/translations';
import type { MigrateOptions } from '@common/types/migrate';
import '../styles/migrate.css';

const optionConfig: Array<{
  key: keyof MigrateOptions;
  labelKey: string;
  icon: React.ReactNode;
}> = [
  { key: 'includeConfig', labelKey: 'migrate.includeConfig', icon: <SettingOutlined /> },
  { key: 'includeLogs', labelKey: 'migrate.includeLogs', icon: <FileTextOutlined /> },
  { key: 'includeData', labelKey: 'migrate.includeData', icon: <DatabaseOutlined /> },
  { key: 'includeSkills', labelKey: 'migrate.includeSkills', icon: <AppstoreOutlined /> },
];

const Migrate: React.FC = () => {
  const {
    status,
    progress,
    options,
    packages,
    setOption,
    startPacking,
    loadPackages,
    deletePackage,
    exportPackage,
  } = useMigrateStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  const handlePack = useCallback(() => {
    startPacking();
  }, [startPacking]);

  const formatDate = useCallback((iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }, []);

  const isPacking = status === 'packing';
  const isDone = status === 'done';
  const hasAnyOption = Object.values(options).some(Boolean);

  return (
    <div className="migrate-page">
      <h2>{t('migrate.title')}</h2>
      <p className="migrate-desc">{t('migrate.description')}</p>

      {/* Package Options */}
      <div className="migrate-section">
        <div className="migrate-section-title">{t('migrate.packageOptions')}</div>

        <div className="migrate-options">
          {optionConfig.map((opt) => (
            <div key={opt.key} className="migrate-option">
              <div className="migrate-option-info">
                <span className="migrate-option-icon">{opt.icon}</span>
                <span className="migrate-option-label">{t(opt.labelKey as any)}</span>
              </div>
              <Switch
                size="small"
                checked={options[opt.key]}
                onChange={(checked) => setOption(opt.key, checked)}
                disabled={isPacking}
              />
            </div>
          ))}
        </div>

        <button
          className="migrate-pack-btn"
          onClick={handlePack}
          disabled={isPacking || !hasAnyOption}
        >
          {isPacking ? (
            <>
              <LoadingOutlined /> {t('migrate.packing')}
            </>
          ) : (
            <>
              <FileZipOutlined /> {t('migrate.startPacking')}
            </>
          )}
        </button>

        {isPacking && (
          <div className="migrate-progress">
            <div className="migrate-progress-bar">
              <div className="migrate-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="migrate-progress-text">{progress}%</div>
          </div>
        )}

        {isDone && (
          <div className="migrate-done">
            <CheckCircleOutlined /> {t('migrate.done')}
          </div>
        )}
      </div>

      {/* Package History */}
      <div className="migrate-section">
        <div className="migrate-section-title">{t('migrate.history')}</div>

        {packages.length === 0 ? (
          <div className="migrate-empty">{t('migrate.noPackages')}</div>
        ) : (
          <div className="migrate-packages">
            {packages.map((pkg) => (
              <div key={pkg.id} className="migrate-package">
                <FileZipOutlined className="migrate-package-icon" />
                <div className="migrate-package-info">
                  <div className="migrate-package-name">{pkg.filename}</div>
                  <div className="migrate-package-meta">
                    <span>{formatDate(pkg.createdAt)}</span>
                    <span>{pkg.size}</span>
                  </div>
                </div>
                <div className="migrate-package-actions">
                  <button className="migrate-pkg-btn" onClick={() => exportPackage(pkg.id)}>
                    <DownloadOutlined /> {t('migrate.export')}
                  </button>
                  <button
                    className="migrate-pkg-btn danger"
                    onClick={() => deletePackage(pkg.id)}
                  >
                    <DeleteOutlined /> {t('migrate.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Migrate;
