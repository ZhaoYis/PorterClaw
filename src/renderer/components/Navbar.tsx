import React, { useMemo, useCallback } from 'react';
import { useNavigationStore, PageKey } from '../stores/navigationStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useTranslation } from '../i18n/translations';

interface NavItem {
  key: PageKey;
  labelKey: 'nav.dashboard' | 'nav.config' | 'nav.logs' | 'nav.migrate' | 'nav.settings';
}

const navItems: NavItem[] = [
  { key: 'dashboard', labelKey: 'nav.dashboard' },
  { key: 'config', labelKey: 'nav.config' },
  { key: 'logs', labelKey: 'nav.logs' },
  { key: 'migrate', labelKey: 'nav.migrate' },
  { key: 'settings', labelKey: 'nav.settings' },
];

export const Navbar: React.FC = React.memo(() => {
  const { activePage, navigate } = useNavigationStore();
  const language = useSettingsStore((s) => s.settings.language);
  const { t } = useTranslation(language);

  const handleClick = useCallback(
    (key: PageKey) => {
      navigate(key);
    },
    [navigate]
  );

  const menuItems = useMemo(() => {
    return navItems.map((item) => (
      <li
        key={item.key}
        className={item.key === activePage ? 'active' : ''}
        onClick={() => handleClick(item.key)}
      >
        {t(item.labelKey)}
      </li>
    ));
  }, [activePage, handleClick, t]);

  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">P</div>
        <span>PorterClaw</span>
      </div>
      <ul className="nav-menu">
        {menuItems}
      </ul>
    </nav>
  );
});

Navbar.displayName = 'Navbar';
