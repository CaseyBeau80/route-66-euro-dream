
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to check if scripts are loaded
const areScriptsLoaded = () => {
  if (window.jQuery) {
    console.log("✅ jQuery is loaded");
    if (window.jQuery.fn.vectorMap) {
      console.log("✅ jVectorMap is loaded");
      return true;
    } else {
      console.log("❌ jVectorMap is not loaded");
      return false;
    }
  } else {
    console.log("❌ jQuery is not loaded");
    return false;
  }
};

// Function to initialize the app when everything is ready
const initApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("❌ Could not find #root element in the DOM");
    return;
  }
  
  // Log script loading status
  areScriptsLoaded();
  
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
