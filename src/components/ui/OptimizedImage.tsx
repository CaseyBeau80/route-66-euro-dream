import React from 'react';
import { OptimizedImg } from './OptimizedImg';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

/**
 * OptimizedImage component that provides:
 * - Modern image format support (WebP fallback)
 * - Responsive sizing 
 * - Lazy loading
 * - Performance optimizations
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '100vw',
  loading = 'lazy',
  priority = false,
  width,
  height,
  style,
  ...props
}) => {
  return <OptimizedImg src={src} alt={alt} className={className} sizes={sizes} loading={loading}
    priority={priority} width={width} height={height} imageWidth={width || 600} style={style} {...props} />;
};
