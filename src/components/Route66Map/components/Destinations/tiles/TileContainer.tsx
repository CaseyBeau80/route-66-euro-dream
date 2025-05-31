
import React from 'react';

interface TileContainerProps {
  children: React.ReactNode;
}

const TileContainer: React.FC<TileContainerProps> = ({ children }) => {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
      {children}
    </div>
  );
};

export default TileContainer;
