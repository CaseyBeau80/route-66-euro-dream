
import React from 'react';

interface ScrollZoomHintProps {
  show: boolean;
}

const ScrollZoomHint: React.FC<ScrollZoomHintProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="bg-black/80 text-white px-6 py-4 rounded-lg shadow-xl backdrop-blur-sm animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-route66-vintage-yellow rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-lg">⌨️</span>
          </div>
          <div>
            <div className="font-semibold text-lg">Hold Ctrl + scroll to zoom</div>
            <div className="text-sm text-gray-300">Or use the zoom controls</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollZoomHint;
