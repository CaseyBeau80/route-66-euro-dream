
import React from 'react';

interface PDFLogoProps {
  className?: string;
}

const PDFLogo: React.FC<PDFLogoProps> = ({ className = "" }) => {
  return (
    <div className={`pdf-logo ${className}`}>
      <img 
        src="/assets/branding/ramble66-logo.png" 
        alt="Ramble 66 - Route 66 Trip Planner" 
        className="h-12 w-auto object-contain"
        onError={(e) => {
          // Hide logo if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default PDFLogo;
