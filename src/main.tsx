import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setupDesktopGuards } from './utils/desktopGuards';

// Import fonts
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';

// Import global styles
import '@styles/tokens.css';
import '@styles/globals.css';

const cleanupDesktopGuards = setupDesktopGuards();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanupDesktopGuards();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
