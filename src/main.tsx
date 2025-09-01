import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  
  // Hide loading skeleton immediately when React starts
  const skeleton = document.getElementById('loading-skeleton');
  if (skeleton) {
    skeleton.style.display = 'none';
  }
  document.body.classList.add('react-loaded');
  
  // Render app directly for faster FCP
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}