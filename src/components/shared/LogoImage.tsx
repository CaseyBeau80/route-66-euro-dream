
import React, { useState, useEffect } from 'react';
import { getRambleLogoUrl, getRambleLogoAlt, testLogoUrl } from '../../utils/logoConfig';

interface LogoImageProps {
  className?: string;
  alt?: string;
  onError?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFallback?: boolean;
}

const LogoImage: React.FC<LogoImageProps> = ({
  className = 'w-10 h-10',
  alt,
  onError,
  showFallback = true
}) => {
  const [imageSrc, setImageSrc] = useState(getRambleLogoUrl());
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Test logo accessibility on mount
    const testLogo = async () => {
      const isAccessible = await testLogoUrl(getRambleLogoUrl());
      if (!isAccessible && showFallback) {
        console.warn('⚠️ Primary logo not accessible, using fallback');
        setImageSrc(getRambleLogoUrl(true));
      }
    };

    testLogo();
  }, [showFallback]);

  const handleError = () => {
    console.error('❌ Logo image failed to load:', imageSrc);
    setHasError(true);
    
    if (showFallback && !imageSrc.includes('placeholder')) {
      console.log('🔄 Switching to fallback logo');
      setImageSrc(getRambleLogoUrl(true));
    }
    
    onError?.();
  };

  const handleLoad = () => {
    console.log('✅ Logo image loaded successfully:', imageSrc);
    setHasError(false);
  };

  return (
    <img 
      src={imageSrc}
      alt={alt || getRambleLogoAlt('default')}
      className={`${className} object-contain`}
      onError={handleError}
      onLoad={handleLoad}
      loading="eager"
      crossOrigin="anonymous"
    />
  );
};

export default LogoImage;
