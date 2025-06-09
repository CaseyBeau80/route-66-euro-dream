
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
    console.log('🖼️ LogoImage: Component mounted with props', {
      className,
      alt,
      showFallback,
      initialSrc: imageSrc
    });

    // Test logo accessibility on mount
    const testLogo = async () => {
      console.log('🧪 LogoImage: Testing logo accessibility on mount');
      const isAccessible = await testLogoUrl(getRambleLogoUrl());
      if (!isAccessible && showFallback) {
        console.warn('⚠️ LogoImage: Primary logo not accessible, switching to fallback');
        setImageSrc(getRambleLogoUrl(true));
      }
    };

    testLogo();
  }, [showFallback, imageSrc]);

  const handleError = () => {
    console.error('❌ LogoImage: Image failed to load', {
      src: imageSrc,
      hasError,
      showFallback
    });
    setHasError(true);
    
    if (showFallback && !imageSrc.includes('placeholder')) {
      console.log('🔄 LogoImage: Switching to fallback logo');
      const fallbackSrc = getRambleLogoUrl(true);
      setImageSrc(fallbackSrc);
      console.log('🔄 LogoImage: Fallback logo set', { fallbackSrc });
    }
    
    onError?.();
  };

  const handleLoad = () => {
    console.log('✅ LogoImage: Image loaded successfully', {
      src: imageSrc,
      className,
      alt: alt || getRambleLogoAlt('default')
    });
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
