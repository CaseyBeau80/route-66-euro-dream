
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure DOM is ready before initializing
const initializeApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("❌ Could not find #root element in the DOM");
    return;
  }
  
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("✅ React app initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize React app:", error);
    
    // Fallback: try without StrictMode wrapper
    try {
      const root = createRoot(rootElement);
      root.render(<App />);
      console.log("✅ React app initialized in fallback mode");
    } catch (fallbackError) {
      console.error("❌ Fallback initialization also failed:", fallbackError);
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  console.log("DOM is still loading, waiting for DOMContentLoaded event");
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  console.log("DOM is already loaded, initializing immediately");
  initializeApp();
}
