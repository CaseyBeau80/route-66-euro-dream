
import React from 'react';

interface ZoomControlsWrapperProps {
  children: React.ReactNode;
}

const ZoomControlsWrapper: React.FC<ZoomControlsWrapperProps> = ({ children }) => {
  return (
    <div 
      className="fixed bottom-20 left-6 z-50"
      style={{ 
        pointerEvents: 'auto',
        position: 'fixed',
        zIndex: 9999
      }}
    >
      {children}
    </div>
  );
};

export default ZoomControlsWrapper;
