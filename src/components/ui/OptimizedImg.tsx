import React, { useState } from 'react';
import { buildSrcSet, getOptimizedImageUrl } from '@/lib/optimizedImage';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { imageWidth?: number; priority?: boolean };

/** No wrapper: preserve the existing image's layout, slots and error placeholder. */
export function OptimizedImg({ src = '', imageWidth = 600, priority = false, sizes, srcSet, loading = 'lazy', onError, ...props }: Props) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [missingSource, setMissingSource] = useState<string | null>(null);
  const fallback = failedSource === src;
  const missing = missingSource === src;
  return <img {...props}
    src={missing ? '/placeholder.svg' : fallback ? src : getOptimizedImageUrl(src, imageWidth)}
    srcSet={fallback || missing ? undefined : buildSrcSet(src, [...new Set([Math.min(400, imageWidth), imageWidth, Math.min(imageWidth * 2, 1200)])]) || srcSet}
    sizes={sizes || `(max-width: 640px) 100vw, ${imageWidth}px`}
    loading={priority ? 'eager' : loading} decoding="async"
    fetchPriority={priority ? 'high' : props.fetchPriority}
    onError={event => {
      if (missing) return;
      if (!fallback && getOptimizedImageUrl(src, imageWidth) !== src) {
        event.currentTarget.removeAttribute('srcset');
        setFailedSource(src);
      } else if (onError) { onError(event); }
      else { setMissingSource(src); }
    }} />;
}