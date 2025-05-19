
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to initialize the app when everything is ready
const initApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("❌ Could not find #root element in the DOM");
    return;
  }
  
  // Check if jQuery and jVectorMap are loaded
  if (window.jQuery) {
    console.log("✅ jQuery is loaded");
    if (window.jQuery.fn.vectorMap) {
      console.log("✅ jVectorMap is loaded");
    } else {
      console.log("❌ jVectorMap is not loaded");
    }
  } else {
    console.log("❌ jQuery is not loaded");
  }
  
  createRoot(rootElement).render(<App />);
};

// Make sure the DOM is loaded before trying to access the root element
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM already loaded, initialize immediately
  initApp();
}
