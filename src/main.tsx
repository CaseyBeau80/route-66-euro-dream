
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Start the application when DOM is fully loaded
const initApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("❌ Could not find #root element in the DOM");
    return;
  }
  
  createRoot(rootElement).render(<App />);
  console.log("✅ React app initialized");
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
