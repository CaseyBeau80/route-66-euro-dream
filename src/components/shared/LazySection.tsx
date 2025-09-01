import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  threshold?: number;
}

/**
 * LazySection - A component that only renders its children when they come into viewport
 * Helps reduce initial DOM size and improves performance
 */
const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = '',
  fallback = null,
  threshold = 0.1
}) => {
  const { elementRef, isVisible, hasBeenVisible } = useIntersectionObserver({
    freezeOnceVisible: true,
    threshold,
  });

  const shouldRender = isVisible || hasBeenVisible;

  return (
    <div ref={elementRef} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
};

export default LazySection;