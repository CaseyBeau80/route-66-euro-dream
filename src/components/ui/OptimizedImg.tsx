import React, { useState } from 'react';
import { buildSrcSet, getOptimizedImageUrl } from '@/lib/optimizedImage';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { imageWidth?: number; priority?: boolean };

/** No wrapper: preserve the existing image's layout, slots and error placeholder. */
export function OptimizedImg({ src = '', imageWidth = 600, priority = false, sizes, srcSet, loading = 'lazy', onError, ...props }: Props) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const fallback = failedSource === src;
  return <img {...props}
    src={fallback ? src : getOptimizedImageUrl(src, imageWidth)}
    srcSet={fallback ? undefined : buildSrcSet(src, [Math.min(400, imageWidth), imageWidth, Math.min(imageWidth * 2, 1200)]) || srcSet}
    sizes={sizes || `(max-width: 640px) 100vw, ${imageWidth}px`}
    loading={priority ? 'eager' : loading} decoding="async"
    fetchPriority={priority ? 'high' : props.fetchPriority}
    onError={event => {
      if (!fallback && getOptimizedImageUrl(src, imageWidth) !== src) {
        event.currentTarget.removeAttribute('srcset');
        setFailedSource(src);
      } else { onError?.(event); }
    }} />;
}