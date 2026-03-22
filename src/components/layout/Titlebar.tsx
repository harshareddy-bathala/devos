import { useState, useEffect } from 'react';
import styles from './Titlebar.module.css';

export default function Titlebar() {
  const [isMaximized, setIsMaximized] = useState(false);

  // Window control handlers - these will be connected to Tauri when available
  const handleMinimize = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().minimize();
    } catch {
      // Browser mode fallback
    }
  };

  const handleMaximize = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const window = getCurrentWindow();
      const maximized = await window.isMaximized();
      if (maximized) {
        await window.unmaximize();
      } else {
        await window.maximize();
      }
      setIsMaximized(!maximized);
    } catch {
      // Browser mode fallback
    }
  };

  const handleClose = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().close();
    } catch {
      // Browser mode fallback
    }
  };

  // Listen for maximize state changes
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const window = getCurrentWindow();
        unlisten = await window.onResized(async () => {
          const maximized = await window.isMaximized();
          setIsMaximized(maximized);
        });
      } catch {
        // Running in browser mode
      }
    };

    setupListener();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  return (
    <div className={styles.titlebar} data-tauri-drag-region>
      <div className={styles.logo}>
        <span className={styles.logoText}>DevOS</span>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.controlButton}
          onClick={handleMinimize}
          aria-label="Minimize"
          data-tauri-drag-region="false"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>

        <button
          className={styles.controlButton}
          onClick={handleMaximize}
          aria-label={isMaximized ? 'Restore' : 'Maximize'}
          data-tauri-drag-region="false"
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="1.5" y="3" width="5.5" height="5.5" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M3.5 3V1.5h5.5v5.5H7.5" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          )}
        </button>

        <button
          className={`${styles.controlButton} ${styles.closeButton}`}
          onClick={handleClose}
          aria-label="Close"
          data-tauri-drag-region="false"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1" />
            <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
