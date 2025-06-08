
import React from 'react';

interface PDFLogoProps {
  className?: string;
  showFallback?: boolean;
}

const PDFLogo: React.FC<PDFLogoProps> = ({ className = "", showFallback = false }) => {
  if (showFallback) {
    return (
      <div className={`pdf-logo-fallback ${className}`}>
        <div className="ramble-66-text-logo">
          <div className="text-4xl font-bold text-route66-primary leading-none">
            RAMBLE
          </div>
          <div className="text-2xl font-bold text-route66-vintage-red leading-none">
            66
          </div>
          <div className="text-xs text-route66-text-secondary font-medium tracking-wider">
            ROUTE 66 TRIP PLANNER
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`pdf-logo ${className}`}>
      <img 
        src="/assets/branding/ramble66-logo.png" 
        alt="Ramble 66 - Route 66 Trip Planner" 
        className="h-12 w-auto object-contain"
        onError={(e) => {
          // Show fallback text logo if image fails to load
          const target = e.target as HTMLImageElement;
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="ramble-66-text-logo">
                <div class="text-4xl font-bold text-route66-primary leading-none">RAMBLE</div>
                <div class="text-2xl font-bold text-route66-vintage-red leading-none">66</div>
                <div class="text-xs text-route66-text-secondary font-medium tracking-wider">ROUTE 66 TRIP PLANNER</div>
              </div>
            `;
          }
        }}
      />
    </div>
  );
};

export default PDFLogo;
