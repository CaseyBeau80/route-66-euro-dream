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
  // Auto-generate WebP version if not provided - with optimized paths for performance
  const getWebPVersion = (originalSrc: string) => {
    if (webpSrc) return webpSrc;
    
    // Handle lovable-uploads with specific optimizations for large images
    if (originalSrc.includes('/lovable-uploads/')) {
      // For logo images - small size optimization (only if WebP exists)
      if (originalSrc.includes('708f8a62-5f36-4d4d-b6b0-35b556d22fba')) {
        return originalSrc.replace('.png', '.webp');
      }
      
      // Skip WebP for main mascot image - use PNG directly for reliability
      if (originalSrc.includes('886a328c-a7f0-4d7c-9f0b-6060859bbe50')) {
        return null;
      }
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