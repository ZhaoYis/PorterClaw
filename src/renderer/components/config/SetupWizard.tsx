import React, { useCallback, useMemo } from 'react';
import {
  CheckCircleOutlined,
  CloseOutlined,
  RocketOutlined,
  ApiOutlined,
  SettingOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { Switch } from 'antd';
import { useConfigStore } from '../../stores/configStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTranslation } from '../../i18n/translations';
import type { SetupStep, ProviderType, LogLevel } from '@common/types/config';

const STEPS: SetupStep[] = ['gateway', 'provider', 'advanced', 'review'];

const PROVIDER_OPTIONS: ProviderType[] = ['openai', 'anthropic', 'azure', 'local', 'custom'];
const LOG_LEVEL_OPTIONS: LogLevel[] = ['debug', 'info', 'warn', 'error'];

export const SetupWizard: React.FC = React.memo(() => {
  const {
    setupStep,
    config,
    isExecuting,
    updateConfigField,
    setSetupStep,
    closeSetupWizard,
    saveConfig,
    executeGatewayAction,
  } = useConfigStore();

  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);

  const currentIndex = STEPS.indexOf(setupStep || 'gateway');

  const goNext = useCallback(() => {
    if (currentIndex < STEPS.length - 1) {
      setSetupStep(STEPS[currentIndex + 1]);
    }
  }, [currentIndex, setSetupStep]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setSetupStep(STEPS[currentIndex - 1]);
    }
  }, [currentIndex, setSetupStep]);

  const handleSave = useCallback(async () => {
    await saveConfig();
    closeSetupWizard();
  }, [saveConfig, closeSetupWizard]);

  const handleSaveAndStart = useCallback(async () => {
    await saveConfig();
    await executeGatewayAction('start');
    closeSetupWizard();
  }, [saveConfig, executeGatewayAction, closeSetupWizard]);

  const stepIcons = useMemo(() => ({
    gateway: <RocketOutlined />,
    provider: <ApiOutlined />,
    advanced: <SettingOutlined />,
    review: <FileSearchOutlined />,
  }), []);

  const stepLabels = useMemo(() => ({
    gateway: t('config.stepGateway' as any),
    provider: t('config.stepProvider' as any),
    advanced: t('config.stepAdvanced' as any),
    review: t('config.stepReview' as any),
  }), [t]);

  const stepDescs: Record<SetupStep, string> = useMemo(() => ({
    gateway: t('config.stepGatewayDesc' as any),
    provider: t('config.stepProviderDesc' as any),
    advanced: t('config.stepAdvancedDesc' as any),
    review: t('config.stepReviewDesc' as any),
  }), [t]);

  const providerLabels: Record<ProviderType, string> = useMemo(() => ({
    openai: t('config.providerOpenai' as any),
    anthropic: t('config.providerAnthropic' as any),
    azure: t('config.providerAzure' as any),
    local: t('config.providerLocal' as any),
    custom: t('config.providerCustom' as any),
  }), [t]);

  if (!setupStep || !config) return null;

  const renderStepContent = () => {
    switch (setupStep) {
      case 'gateway':
        return (
          <div className="wizard-form-group">
            <div className="config-field">
              <span className="config-field-label">{t('config.port')}</span>
              <input
                type="number"
                className="config-field-input"
                value={config.gateway.port}
                onChange={(e) => updateConfigField('gateway.port', parseInt(e.target.value, 10) || 18789)}
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
                onChange={(e) => updateConfigField('gateway.host', e.target.value)}
              />
            </div>
            <div className="config-field">
              <span className="config-field-label">{t('config.authToken' as any)}</span>
              <input
                type="password"
                className="config-field-input wide"
                value={config.gateway.authToken || ''}
                onChange={(e) => updateConfigField('gateway.authToken', e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="config-field">
              <span className="config-field-label">{t('config.daemon')}</span>
              <Switch
                checked={config.gateway.daemon}
                onChange={(checked) => updateConfigField('gateway.daemon', checked)}
                size="small"
              />
            </div>
          </div>
        );

      case 'provider':
        return (
          <div className="wizard-form-group">
            <div className="config-field">
              <span className="config-field-label">{t('config.providerType' as any)}</span>
              <select
                className="config-field-select"
                value={config.provider.type}
                onChange={(e) => updateConfigField('provider.type', e.target.value)}
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
                className="config-field-input wide"
                value={config.provider.apiKey}
                onChange={(e) => updateConfigField('provider.apiKey', e.target.value)}
                placeholder="sk-..."
              />
            </div>
            <div className="config-field">
              <span className="config-field-label">{t('config.baseUrl' as any)}</span>
              <input
                type="text"
                className="config-field-input wide"
                value={config.provider.baseUrl}
                onChange={(e) => updateConfigField('provider.baseUrl', e.target.value)}
              />
            </div>
            <div className="config-field">
              <span className="config-field-label">{t('config.model' as any)}</span>
              <input
                type="text"
                className="config-field-input"
                value={config.provider.model}
                onChange={(e) => updateConfigField('provider.model', e.target.value)}
                placeholder="gpt-4"
              />
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="wizard-form-group">
            <div className="config-field">
              <span className="config-field-label">{t('config.skillsDir' as any)}</span>
              <input
                type="text"
                className="config-field-input wide"
                value={config.skills.directory}
                onChange={(e) => updateConfigField('skills.directory', e.target.value)}
              />
            </div>
            <div className="config-field">
              <span className="config-field-label">{t('config.autoLoadSkills' as any)}</span>
              <Switch
                checked={config.skills.autoLoad}
                onChange={(checked) => updateConfigField('skills.autoLoad', checked)}
                size="small"
              />
            </div>
            <div className="config-field">
              <span className="config-field-label">{t('config.logLevel' as any)}</span>
              <select
                className="config-field-select"
                value={config.logging.level}
                onChange={(e) => updateConfigField('logging.level', e.target.value)}
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
                className="config-field-input wide"
                value={config.logging.file}
                onChange={(e) => updateConfigField('logging.file', e.target.value)}
              />
            </div>
          </div>
        );

      case 'review': {
        const previewConfig = {
          gateway: config.gateway,
          provider: { ...config.provider, apiKey: config.provider.apiKey ? '***' : '' },
          skills: config.skills,
          logging: config.logging,
        };
        return (
          <>
            <div className="wizard-step-desc">{t('config.configPreview' as any)}</div>
            <div className="wizard-json-preview">
              {JSON.stringify(previewConfig, null, 2)}
            </div>
          </>
        );
      }
    }
  };

  return (
    <div className="config-section">
      <div className="wizard-header">
        <div className="wizard-header-left">
          <div className="wizard-title">{t('config.setupWizard' as any)}</div>
          <div className="wizard-desc">{t('config.setupDesc' as any)}</div>
        </div>
        <button className="wizard-btn" onClick={closeSetupWizard}>
          <CloseOutlined /> {t('config.skipSetup' as any)}
        </button>
      </div>

      <div className="wizard-steps">
        {STEPS.map((step, idx) => {
          const isActive = step === setupStep;
          const isCompleted = idx < currentIndex;
          const cls = `wizard-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
          return (
            <div key={step} className={cls} onClick={() => setSetupStep(step)}>
              <div className="wizard-step-indicator">
                {isCompleted ? <CheckCircleOutlined /> : stepIcons[step]}
              </div>
              <span className="wizard-step-label">{stepLabels[step]}</span>
              {idx < STEPS.length - 1 && <div className="wizard-step-connector" />}
            </div>
          );
        })}
      </div>

      <div className="wizard-content">
        <div className="wizard-step-desc">{stepDescs[setupStep]}</div>
        {renderStepContent()}
      </div>

      <div className="wizard-actions">
        <div className="wizard-actions-left">
          {currentIndex > 0 && (
            <button className="wizard-btn" onClick={goPrev}>
              {t('config.prevStep' as any)}
            </button>
          )}
        </div>
        <div className="wizard-actions-right">
          {setupStep === 'review' ? (
            <>
              <button
                className="wizard-btn primary"
                onClick={handleSave}
                disabled={isExecuting}
              >
                {t('config.save')}
              </button>
              <button
                className="wizard-btn success"
                onClick={handleSaveAndStart}
                disabled={isExecuting}
              >
                <RocketOutlined /> {t('config.saveAndStart' as any)}
              </button>
            </>
          ) : (
            <button className="wizard-btn primary" onClick={goNext}>
              {t('config.nextStep' as any)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

SetupWizard.displayName = 'SetupWizard';
