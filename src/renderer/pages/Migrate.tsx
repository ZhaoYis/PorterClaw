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
  FolderOutlined,
  ScanOutlined,
  BookOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useMigrateStore } from '../stores/migrateStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useTranslation } from '../i18n/translations';
import '../styles/migrate.css';

const categoryIcons: Record<string, React.ReactNode> = {
  config: <SettingOutlined />,
  skills: <AppstoreOutlined />,
  logs: <FileTextOutlined />,
  data: <DatabaseOutlined />,
  cache: <FolderOutlined />,
  plugins: <AppstoreOutlined />,
  templates: <FolderOutlined />,
  backups: <FolderOutlined />,
  memory: <BookOutlined />,
  agents: <RobotOutlined />,
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

const Migrate: React.FC = () => {
  const {
    status,
    progress,
    categories,
    selectedCategories,
    packages,
    scanFiles,
    toggleCategory,
    startPacking,
    loadPackages,
    deletePackage,
    exportPackage,
  } = useMigrateStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);

  useEffect(() => {
    scanFiles();
    loadPackages();
  }, [scanFiles, loadPackages]);

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
  const isScanning = status === 'scanning';
  const isDone = status === 'done';
  const hasAnySelected = Object.values(selectedCategories).some(Boolean);

  const getCategoryLabel = (key: string): string => {
    const translationKey = `migrate.cat${key.charAt(0).toUpperCase()}${key.slice(1)}` as any;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : key;
  };

  return (
    <div className="migrate-page">
      <h2>{t('migrate.title')}</h2>
      <p className="migrate-desc">{t('migrate.description')}</p>

      {/* Category Selection */}
      <div className="migrate-section">
        <div className="migrate-section-title">
          {t('migrate.packageOptions')}
          {isScanning && <LoadingOutlined style={{ marginLeft: 8 }} />}
        </div>

        {categories.length === 0 && !isScanning ? (
          <div className="migrate-empty">
            <ScanOutlined style={{ fontSize: 20, marginRight: 8 }} />
            {t('migrate.noFiles')}
          </div>
        ) : (
          <div className="migrate-options">
            {categories.map((cat) => (
              <div key={cat.key} className="migrate-option">
                <div className="migrate-option-left">
                  <span className="migrate-option-icon">
                    {categoryIcons[cat.key] || <FolderOutlined />}
                  </span>
                  <div className="migrate-option-details">
                    <span className="migrate-option-label">{getCategoryLabel(cat.key)}</span>
                    <div className="migrate-option-meta">
                      <span>{cat.fileCount} {t('migrate.filesUnit')}</span>
                      <span className="migrate-meta-sep">·</span>
                      <span>{formatSize(cat.totalSize)}</span>
                      <span className="migrate-meta-sep">·</span>
                      <span className="migrate-option-path">{cat.path}</span>
                    </div>
                  </div>
                </div>
                <Switch
                  size="small"
                  checked={selectedCategories[cat.key] ?? true}
                  onChange={(checked) => toggleCategory(cat.key, checked)}
                  disabled={isPacking}
                />
              </div>
            ))}
          </div>
        )}

        <button
          className="migrate-pack-btn"
          onClick={handlePack}
          disabled={isPacking || isScanning || !hasAnySelected}
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
