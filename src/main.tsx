import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('🚀 Main.tsx loading...');

// GitHub Pages SPA routing fix
(function(l) {
  if (l.search[1] === '/' ) {
    var decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, '', l.pathname.slice(0, -1) + decoded + l.hash);
  }
}(window.location));

console.log('🔍 Looking for root element...');
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ No root element found!');
  document.body.innerHTML = '<h1>Error: No root element found</h1>';
} else {
  console.log('✅ Root element found, creating React app...');
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('✅ React app rendered successfully');
  } catch (error) {
    console.error('❌ Error rendering React app:', error);
    rootElement.innerHTML = `<h1>Error: ${error.message}</h1>`;
  }
}