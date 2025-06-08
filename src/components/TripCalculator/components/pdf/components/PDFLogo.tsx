
import React from 'react';
import { Route } from 'lucide-react';

interface PDFLogoProps {
  showFallback?: boolean;
}

const PDFLogo: React.FC<PDFLogoProps> = ({ showFallback = true }) => {
  // Always use the text-based logo for PDF to ensure it prints correctly
  return (
    <div className="pdf-logo flex items-center justify-center gap-2 mb-4">
      <div className="bg-route66-primary rounded-full p-2 flex items-center justify-center">
        <Route className="w-6 h-6 text-white" />
      </div>
      <div className="ramble-66-text-logo text-center">
        <div className="flex items-center gap-1 justify-center">
          <div className="font-bold text-route66-primary text-xl leading-none">
            RAMBLE
          </div>
          <div className="font-bold text-route66-primary text-xl leading-none">
            66
          </div>
        </div>
        <div className="text-xs text-route66-text-secondary font-medium tracking-wider mt-1">
          ROUTE 66 TRIP PLANNER
        </div>
      </div>
    </div>
  );
};

export default PDFLogo;
