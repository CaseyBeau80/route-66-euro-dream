
import React from 'react';

interface DebugComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Production-safe wrapper for debug components that ensures they never render in production
 */
const DebugComponentWrapper: React.FC<DebugComponentWrapperProps> = ({ 
  children, 
  fallback = null 
}) => {
  // Multiple layers of production detection
  const isProduction = process.env.NODE_ENV === 'production' || 
                      import.meta.env.PROD ||
                      window.location.hostname !== 'localhost';
  
  // Runtime environment check as backup
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       import.meta.env.DEV ||
                       window.location.hostname === 'localhost';
  
  // Only render in development environment
  if (isProduction || !isDevelopment) {
    return fallback as React.ReactElement;
  }
  
  return (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  );
};

export default DebugComponentWrapper;
