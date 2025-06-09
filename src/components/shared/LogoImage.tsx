
import React, { useState, useEffect } from 'react';
import { getRambleLogoUrl, getRambleLogoAlt, testLogoUrl } from '../../utils/logoConfig';

interface LogoImageProps {
  className?: string;
  alt?: string;
  onError?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const LogoImage: React.FC<LogoImageProps> = ({
  className = 'w-10 h-10',
  alt,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState(getRambleLogoUrl());
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log('🖼️ LogoImage: Component mounted with props', {
      className,
      alt,
      initialSrc: imageSrc
    });

    // Test logo accessibility on mount
    const testLogo = async () => {
      console.log('🧪 LogoImage: Testing logo accessibility on mount');
      const isAccessible = await testLogoUrl(getRambleLogoUrl());
      if (!isAccessible) {
        console.warn('⚠️ LogoImage: Primary logo not accessible');
      }
    };

    testLogo();
  }, [imageSrc, className, alt]);

  const handleError = () => {
    console.error('❌ LogoImage: Image failed to load', {
      src: imageSrc,
      hasError
    });
    setHasError(true);
    onError?.();
  };

  const handleLoad = () => {
    console.log('✅ LogoImage: Image loaded successfully', {
      src: imageSrc,
      className,
      alt: alt || getRambleLogoAlt()
    });
    setHasError(false);
  };

  return (
    <img 
      src={imageSrc}
      alt={alt || getRambleLogoAlt()}
      className={`${className} object-contain`}
      onError={handleError}
      onLoad={handleLoad}
      loading="eager"
      crossOrigin="anonymous"
    />
  );
};

export default LogoImage;
