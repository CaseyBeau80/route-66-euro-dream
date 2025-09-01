import React from 'react';

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
  // Generate optimized URL with WebP format and proper sizing
  const getOptimizedUrl = (url: string, targetWidth?: number, targetHeight?: number) => {
    if (url.includes('/lovable-uploads/')) {
      const params = new URLSearchParams();
      if (targetWidth) params.set('w', targetWidth.toString());
      if (targetHeight) params.set('h', targetHeight.toString());
      params.set('format', 'webp');
      params.set('quality', '85');
      params.set('fit', 'contain');
      
      return `${url}?${params.toString()}`;
    }
    return url;
  };

  // Generate WebP version of the image URL if it's a PNG/JPG
  const getWebPVersion = (url: string) => {
    if (url.includes('/lovable-uploads/') && (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg'))) {
      return getOptimizedUrl(url, width, height);
    }
    return null;
  };

  // Generate different sizes for responsive images
  const generateSrcSet = (baseUrl: string) => {
    // For all lovable-uploads images, generate responsive sizes
    if (baseUrl.includes('/lovable-uploads/')) {
      // For large hero/mascot images - optimize for exact display sizes
      if (baseUrl.includes('625379a4-1f3a-4507-b7ae-394af1f403ae') || 
          baseUrl.includes('56c17d61-50a4-49c7-a00f-e49e4806a4b3')) {
        return [
          `${baseUrl}?w=588&h=803&fit=contain&format=webp&quality=85 588w`,
          `${baseUrl}?w=400&h=546&fit=contain&format=webp&quality=85 400w`,
          `${baseUrl}?w=294&h=402&fit=contain&format=webp&quality=85 294w`
        ].join(', ');
      }
      
      // For logos and smaller images (40x40 display)
      if (baseUrl.includes('708f8a62-5f36-4d4d-b6b0-35b556d22fba')) {
        return [
          `${baseUrl}?w=40&h=40&fit=contain&format=webp&quality=90 40w`,
          `${baseUrl}?w=80&h=80&fit=contain&format=webp&quality=90 80w`,
          `${baseUrl}?w=128&h=128&fit=contain&format=webp&quality=90 128w`
        ].join(', ');
      }
      
      // Generic responsive sizing for other uploaded images
      return [
        `${baseUrl}?w=400&format=webp&quality=85 400w`,
        `${baseUrl}?w=600&format=webp&quality=85 600w`,
        `${baseUrl}?w=800&format=webp&quality=85 800w`
      ].join(', ');
    }
    
    return src;
  };

  const webpSrc = getWebPVersion(src);
  const srcSet = generateSrcSet(src);

  const loadingStrategy = priority ? 'eager' : loading;
  
  // For LCP images, add fetchpriority attribute
  const fetchPriority = priority ? 'high' : undefined;

  return (
    <picture>
      {/* Modern WebP format with responsive sizes */}
      {webpSrc && (
        <source
          srcSet={generateSrcSet(webpSrc)}
          type="image/webp"
          sizes={sizes}
        />
      )}
      
      {/* Fallback to original format with responsive sizes */}
      <source
        srcSet={srcSet}
        type={src.includes('.png') ? 'image/png' : 'image/jpeg'}
        sizes={sizes}
      />
      
      {/* Final fallback img element with optimized src and fetchpriority */}
      <img
        src={getOptimizedUrl(src, width, height)}
        alt={alt}
        className={className}
        loading={loadingStrategy}
        width={width}
        height={height}
        style={style}
        decoding="async"
        fetchPriority={fetchPriority}
        {...props}
      />
    </picture>
  );
};