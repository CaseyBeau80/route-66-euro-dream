import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('🚀 main.tsx: Starting application');

const rootElement = document.getElementById('root');
console.log('🎯 main.tsx: Root element found:', !!rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log('✅ main.tsx: React root created, rendering App');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ main.tsx: App rendered successfully');
} else {
  console.error('❌ main.tsx: Root element not found!');
}