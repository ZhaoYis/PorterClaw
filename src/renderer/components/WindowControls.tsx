import React, { useCallback } from 'react';

export const WindowControls: React.FC = React.memo(() => {
  const handleMinimize = useCallback(() => {
    window.electron.window.minimize();
  }, []);

  const handleMaximize = useCallback(() => {
    window.electron.window.maximize();
  }, []);

  const handleClose = useCallback(() => {
    window.electron.window.close();
  }, []);

  return (
    <div className="window-controls">
      <button
        className="window-btn minimize"
        onClick={handleMinimize}
        aria-label="Minimize"
      />
      <button
        className="window-btn maximize"
        onClick={handleMaximize}
        aria-label="Maximize"
      />
      <button
        className="window-btn close"
        onClick={handleClose}
        aria-label="Close"
      />
    </div>
  );
});

WindowControls.displayName = 'WindowControls';
