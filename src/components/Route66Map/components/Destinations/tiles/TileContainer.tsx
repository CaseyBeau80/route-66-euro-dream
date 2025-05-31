
import React from 'react';

interface TileContainerProps {
  children: React.ReactNode;
  className?: string;
}

const TileContainer: React.FC<TileContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 ${className}`}>
      {children}
    </div>
  );
};

export default TileContainer;
