import React from 'react';

interface PictureOptimizedProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
  webpSrc?: string;
  avifSrc?: string;
}

export const PictureOptimized: React.FC<PictureOptimizedProps> = ({
  src,
  alt,
  className,
  sizes,
  width,
  height,
  priority = false,
  loading = 'lazy',
  style,
  webpSrc,
  avifSrc,
  ...props
}) => {
  // Auto-generate WebP version if not provided
  const getWebPVersion = (originalSrc: string) => {
    if (webpSrc) return webpSrc;
    
    // For lovable-uploads, try WebP version
    if (originalSrc.includes('/lovable-uploads/') && originalSrc.includes('.png')) {
      return originalSrc.replace('.png', '.webp');
    }
    
    // For assets, try WebP version
    if (originalSrc.startsWith('/assets/') && originalSrc.includes('.png')) {
      return originalSrc.replace('.png', '.webp');
    }
    
    return null;
  };

  const webpVersion = getWebPVersion(src);
  const loadingValue = priority ? 'eager' : loading;

  return (
    <picture>
      {/* AVIF format (most efficient) */}
      {avifSrc && (
        <source srcSet={avifSrc} type="image/avif" sizes={sizes} />
      )}
      
      {/* WebP format (widely supported) */}
      {webpVersion && (
        <source srcSet={webpVersion} type="image/webp" sizes={sizes} />
      )}
      
      {/* Fallback to original format */}
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loadingValue}
        style={style}
        sizes={sizes}
        {...props}
      />
    </picture>
  );
};