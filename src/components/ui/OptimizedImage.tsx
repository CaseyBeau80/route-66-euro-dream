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
  // Generate WebP version of the image URL if it's a PNG/JPG
  const getWebPVersion = (url: string) => {
    if (url.includes('/lovable-uploads/') && (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg'))) {
      return url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }
    return null;
  };

  // Generate different sizes for responsive images
  const generateSrcSet = (baseUrl: string) => {
    if (baseUrl.includes('/lovable-uploads/')) {
      // For large images, provide multiple sizes
      if (baseUrl.includes('625379a4-1f3a-4507-b7ae-394af1f403ae')) {
        return [
          `${baseUrl} 999w`,
          // We'll resize programmatically by adding size parameters
          `${baseUrl}?w=800 800w`,
          `${baseUrl}?w=600 600w`,
          `${baseUrl}?w=400 400w`
        ].join(', ');
      }
      
      // For logos and smaller images
      if (baseUrl.includes('708f8a62-5f36-4d4d-b6b0-35b556d22fba')) {
        return [
          `${baseUrl} 1024w`,
          `${baseUrl}?w=128 128w`,
          `${baseUrl}?w=64 64w`,
          `${baseUrl}?w=40 40w`
        ].join(', ');
      }
    }
    
    return src;
  };

  const webpSrc = getWebPVersion(src);
  const srcSet = generateSrcSet(src);

  // For critical images, use eager loading
  const loadingStrategy = priority ? 'eager' : loading;

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
      
      {/* Final fallback img element */}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loadingStrategy}
        width={width}
        height={height}
        style={style}
        decoding="async"
        {...props}
      />
    </picture>
  );
};