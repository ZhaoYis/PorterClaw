import React, { useMemo } from 'react';
import { WindowControls } from './WindowControls';

interface NavItem {
  key: string;
  label: string;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'config', label: 'Config' },
  { key: 'logs', label: 'Logs' },
  { key: 'migrate', label: 'Migrate' },
  { key: 'settings', label: 'Settings' },
];

export const Navbar: React.FC = React.memo(() => {
  const activeKey = 'dashboard';

  const menuItems = useMemo(() => {
    return navItems.map((item) => (
      <li
        key={item.key}
        className={item.key === activeKey ? 'active' : ''}
      >
        {item.label}
      </li>
    ));
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">P</div>
        <span>PorterClaw</span>
      </div>
      <ul className="nav-menu">
        {menuItems}
      </ul>
      <WindowControls />
    </nav>
  );
});

Navbar.displayName = 'Navbar';
