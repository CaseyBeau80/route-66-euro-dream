
import React from 'react';

interface PDFLogoProps {
  showFallback?: boolean;
}

const PDFLogo: React.FC<PDFLogoProps> = ({ showFallback = true }) => {
  return (
    <div className="pdf-logo flex items-center gap-2">
      {showFallback ? (
        <>
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">R66</span>
          </div>
          <div className="text-sm">
            <div className="font-bold text-blue-800">Ramble 66</div>
            <div className="text-xs text-blue-600">Route 66 Trip Planner</div>
          </div>
        </>
      ) : (
        <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500 text-xs">Logo</span>
        </div>
      )}
    </div>
  );
};

export default PDFLogo;
