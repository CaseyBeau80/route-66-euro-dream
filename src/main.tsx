
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Start the application when DOM is fully loaded
const initApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("❌ Could not find #root element in the DOM");
    return;
  }
  
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log("✅ React app initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize React app:", error);
    // Fallback rendering without StrictMode
    try {
      const root = createRoot(rootElement);
      root.render(<App />);
      console.log("✅ React app initialized in fallback mode");
    } catch (fallbackError) {
      console.error("❌ Fallback initialization also failed:", fallbackError);
    }
  }
};

// Make sure the DOM is loaded before trying to access the root element
if (document.readyState === 'loading') {
  console.log("DOM is still loading, waiting for DOMContentLoaded event");
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM already loaded, initialize immediately
  console.log("DOM is already loaded, initializing immediately");
  initApp();
}
