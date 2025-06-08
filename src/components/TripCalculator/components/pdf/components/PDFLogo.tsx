
import React, { useState } from 'react';
import RambleBranding from '../../../../shared/RambleBranding';

interface PDFLogoProps {
  showFallback?: boolean;
}

const PDFLogo: React.FC<PDFLogoProps> = ({ showFallback = true }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.log('🖼️ Failed to load Ramble 66 logo, falling back to component');
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('✅ Ramble 66 logo loaded successfully');
  };

  // If image failed to load or showFallback is false, use RambleBranding component
  if (imageError || !showFallback) {
    return (
      <div className="pdf-logo">
        <RambleBranding variant="full" size="sm" />
      </div>
    );
  }

  return (
    <div className="pdf-logo flex items-center gap-2">
      <img
        src="/assets/branding/ramble66-logo.png"
        alt="Ramble 66 Logo"
        className="h-10 w-auto"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ maxHeight: '40px', height: 'auto' }}
      />
      <div className="text-sm">
        <div className="font-bold text-blue-800">Ramble 66</div>
        <div className="text-xs text-blue-600">Route 66 Trip Planner</div>
      </div>
    </div>
  );
};

export default PDFLogo;
