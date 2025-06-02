
import React from 'react';

interface ZoomDisplayProps {
  currentZoom: number;
  isZooming: boolean;
}

const ZoomDisplay: React.FC<ZoomDisplayProps> = ({ currentZoom, isZooming }) => {
  return (
    <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
      <span className="text-gray-800">{Math.round(currentZoom * 10) / 10}</span>
      {isZooming && <span className="ml-1 text-blue-600 animate-pulse">•</span>}
    </div>
  );
};

export default ZoomDisplay;
