import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { Navbar } from './components/Navbar';
import { useNavigationStore } from './stores/navigationStore';
import { useSettingsStore } from './stores/settingsStore';
import Dashboard from './pages/Dashboard';
import Config from './pages/Config';
import Logs from './pages/Logs';
import Migrate from './pages/Migrate';
import Settings from './pages/Settings';
import './styles/dashboard.css';

const PageRenderer: React.FC = () => {
  const activePage = useNavigationStore((s) => s.activePage);

  switch (activePage) {
    case 'dashboard':
      return <Dashboard />;
    case 'config':
      return <Config />;
    case 'logs':
      return <Logs />;
    case 'migrate':
      return <Migrate />;
    case 'settings':
      return <Settings />;
    default:
      return <Dashboard />;
  }
};

const App: React.FC = () => {
  const themeMode = useSettingsStore((s) => s.settings.theme);

  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0066FF',
          colorSuccess: '#00C853',
          colorBgBase: isDark ? '#1E1E1E' : '#f5f5f5',
          colorBgContainer: isDark ? '#252526' : '#ffffff',
          colorBorder: isDark ? '#333' : '#d9d9d9',
          borderRadius: 8,
        },
      }}
    >
      <div className={`app-window ${isDark ? 'theme-dark' : 'theme-light'}`}>
        <Navbar />
        <main className="main-content">
          <PageRenderer />
        </main>
      </div>
    </ConfigProvider>
  );
};

export default App;
