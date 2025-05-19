
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure the DOM is loaded before trying to access the root element
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("❌ Could not find #root element in the DOM");
    return;
  }
  
  createRoot(rootElement).render(<App />);
});
