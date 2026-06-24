import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AdaptivePerformanceProvider } from './contexts/AdaptivePerformanceContext.tsx';
import { registerServiceWorker } from './lib/serviceWorker.ts';
import './index.css';

// Register Service Worker for offline support & caching
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdaptivePerformanceProvider>
      <App />
    </AdaptivePerformanceProvider>
  </StrictMode>,
);
