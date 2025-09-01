import React, { useState, useEffect, useRef, ComponentType } from 'react';

interface DeferredComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  delay?: number;
}

/**
 * Component that defers rendering until it's near the viewport
 * Reduces initial JavaScript execution time
 */
export const DeferredComponent: React.FC<DeferredComponentProps> = ({
  children,
  fallback = null,
  rootMargin = '100px',
  threshold = 0.1,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Use intersection observer for efficient visibility detection
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold]);

  useEffect(() => {
    if (isVisible) {
      // Add delay to further defer JavaScript execution
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  return (
    <div ref={elementRef}>
      {shouldRender ? children : fallback}
    </div>
  );
};

/**
 * Higher-order component for deferring heavy components
 */
export function withDeferredLoading<P extends object>(
  Component: ComponentType<P>,
  options: {
    fallback?: React.ReactNode;
    rootMargin?: string;
    threshold?: number;
    delay?: number;
  } = {}
) {
  return function DeferredWrapper(props: P) {
    return (
      <DeferredComponent {...options}>
        <Component {...props} />
      </DeferredComponent>
    );
  };
}