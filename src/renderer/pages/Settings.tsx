import React, { useCallback, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useSettingsStore } from '../stores/settingsStore';
import { useTranslation } from '../i18n/translations';
import type { ThemeMode, Language } from '@common/types/settings';
import '../styles/settings.css';

const Settings: React.FC = () => {
  const { settings, setTheme, setLanguage, setGatewayPort, setGatewayHost, resetSettings } =
    useSettingsStore();
  const { t } = useTranslation(settings.language);
  const [modal, contextHolder] = Modal.useModal();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleThemeChange = useCallback(
    (theme: ThemeMode) => {
      setTheme(theme);
    },
    [setTheme]
  );

  const handleLanguageChange = useCallback(
    (lang: Language) => {
      setLanguage(lang);
    },
    [setLanguage]
  );

  const handlePortChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const port = parseInt(e.target.value, 10);
      if (!isNaN(port) && port > 0 && port <= 65535) {
        setGatewayPort(port);
      }
    },
    [setGatewayPort]
  );

  const handleHostChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGatewayHost(e.target.value);
    },
    [setGatewayHost]
  );

  const handleReset = useCallback(() => {
    modal.confirm({
      title: t('settings.resetSettings'),
      content: t('settings.resetConfirm'),
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        resetSettings();
        showToast(t('common.success'));
      },
    });
  }, [modal, resetSettings, showToast, t]);

  const handleClearCache = useCallback(() => {
    try {
      // Only clear porterclaw-related cache, not settings
      const keys = Object.keys(localStorage).filter(
        (k) => k.startsWith('porterclaw_') && k !== 'porterclaw_settings'
      );
      keys.forEach((k) => localStorage.removeItem(k));
      showToast(t('common.success'));
    } catch {
      // ignore
    }
  }, [showToast, t]);

  const handleCheckUpdate = useCallback(() => {
    showToast(t('settings.upToDate'));
  }, [showToast, t]);

  return (
    <div className="settings-page">
      <h2>{t('settings.title')}</h2>

      {/* Appearance */}
      <div className="settings-section">
        <div className="settings-section-title">{t('settings.appearance')}</div>

        <div className="settings-row">
          <div className="settings-label">
            <span className="settings-label-text">{t('settings.theme')}</span>
          </div>
          <div className="settings-control">
            <div className="theme-selector">
              {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
                <button
                  key={mode}
                  className={`theme-option ${settings.theme === mode ? 'active' : ''}`}
                  onClick={() => handleThemeChange(mode)}
                >
                  {t(`settings.theme${mode.charAt(0).toUpperCase() + mode.slice(1)}` as any)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-label">
            <span className="settings-label-text">{t('settings.language')}</span>
          </div>
          <div className="settings-control">
            <div className="language-selector">
              {(['en', 'zh'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  className={`language-option ${settings.language === lang ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang)}
                >
                  {t(`settings.language${lang.charAt(0).toUpperCase() + lang.slice(1)}` as any)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Connection */}
      <div className="settings-section">
        <div className="settings-section-title">{t('settings.gateway')}</div>

        <div className="settings-row">
          <div className="settings-label">
            <span className="settings-label-text">{t('settings.gatewayHost')}</span>
          </div>
          <div className="settings-control">
            <input
              type="text"
              className="settings-input wide"
              value={settings.gatewayHost}
              onChange={handleHostChange}
              placeholder="localhost"
            />
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-label">
            <span className="settings-label-text">{t('settings.gatewayPort')}</span>
          </div>
          <div className="settings-control">
            <input
              type="number"
              className="settings-input"
              value={settings.gatewayPort}
              onChange={handlePortChange}
              min={1}
              max={65535}
            />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="settings-section">
        <div className="settings-section-title">{t('settings.about')}</div>

        <div className="settings-row">
          <div className="settings-label">
            <span className="settings-label-text">{t('settings.version')}</span>
          </div>
          <div className="settings-control">
            <div className="about-info">
              <span className="about-version">v0.12.3</span>
              <button className="settings-btn" onClick={handleCheckUpdate}>
                {t('settings.checkUpdate')}
              </button>
            </div>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-label">
            <span className="settings-label-text">{t('settings.website')}</span>
          </div>
          <div className="settings-control">
            <a
              className="about-link"
              href="https://openclaw.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              openclaw.ai ↗
            </a>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="settings-section">
        <div className="settings-section-title">{t('settings.data')}</div>

        <div className="settings-row">
          <div className="settings-label">
            <span className="settings-label-text">{t('settings.clearCache')}</span>
          </div>
          <div className="settings-control">
            <button className="settings-btn" onClick={handleClearCache}>
              {t('settings.clearCache')}
            </button>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-label">
            <span className="settings-label-text">{t('settings.resetSettings')}</span>
          </div>
          <div className="settings-control">
            <button className="settings-btn danger" onClick={handleReset}>
              {t('settings.resetSettings')}
            </button>
          </div>
        </div>
      </div>

      {contextHolder}
      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
};

export default Settings;
