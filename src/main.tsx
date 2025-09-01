import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Lazy load the main App component to improve FCP
const App = import('./App.tsx');

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  
  // Render with immediate loading state for better FCP
  root.render(
    <StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-route66 font-bold text-route66-primary mb-4">RAMBLE 66</h1>
          <p className="text-lg text-route66-primary-light mb-6">Loading your Route 66 adventure...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-route66-primary mx-auto"></div>
        </div>
      </div>
    </StrictMode>
  );
  
  // Load and render the actual app
  App.then(({ default: AppComponent }) => {
    root.render(
      <StrictMode>
        <AppComponent />
      </StrictMode>
    );
  }).catch(console.error);
}