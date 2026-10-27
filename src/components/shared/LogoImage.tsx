
import React, { useState } from 'react';

interface LogoImageProps {
  className?: string;
  alt?: string;
  onError?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const LogoImage: React.FC<LogoImageProps> = ({
  className = 'w-10 h-10',
  alt = 'Ramble 66 Logo',
  onError
}) => {
  const [hasError, setHasError] = useState(false);
  
  // Direct URL to your Supabase logo
  const logoUrl = "/images/ramble66-logo-512.webp";
  
  ;

  const handleError = () => {
    console.error('❌ LogoImage: Failed to load logo from Supabase', {
      logoUrl,
      timestamp: new Date().toISOString()
    });
    setHasError(true);
    onError?.();
  };

  const handleLoad = () => {
    ;
    setHasError(false);
  };

  return (
    <img 
      src={logoUrl}
      alt={alt}
      className={`${className} object-contain`}
      onError={handleError}
      onLoad={handleLoad}
      loading="eager"
      crossOrigin="anonymous"
      style={{ 
        filter: 'none',
        WebkitFilter: 'none'
      }}
    />
  );
};

export default LogoImage;
