
import React from 'react';
import { Route } from 'lucide-react';
import LogoImage from '../../../../shared/LogoImage';

interface PDFLogoProps {
  showFallback?: boolean;
}

const PDFLogo: React.FC<PDFLogoProps> = ({ showFallback = true }) => {
  return (
    <div className="pdf-logo flex items-center justify-center gap-2 mb-4">
      <div className="bg-route66-primary rounded-full p-2 flex items-center justify-center mx-auto">
        <LogoImage 
          className="w-6 h-6 object-contain"
          alt="Ramble 66 - Route 66 Trip Planner"
          showFallback={showFallback}
          onError={() => {
            if (showFallback) {
              // Show fallback icon if image fails
              const logoImg = document.querySelector('.pdf-logo img');
              const fallbackIcon = document.querySelector('.pdf-logo .lucide-route');
              if (logoImg && fallbackIcon) {
                logoImg.style.display = 'none';
                fallbackIcon.classList.remove('hidden');
              }
            }
          }}
        />
        <Route className="w-6 h-6 text-white hidden" />
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
        <div className="text-xs text-route66-text-secondary font-medium tracking-wider mt-1 text-center">
          ROUTE 66 TRIP PLANNER
        </div>
      </div>
    </div>
  );
};

export default PDFLogo;
