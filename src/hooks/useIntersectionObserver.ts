import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  const { freezeOnceVisible = false, ...observerOptions } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        if (isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }

        if (freezeOnceVisible && hasBeenVisible && !isIntersecting) {
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
        ...observerOptions,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [freezeOnceVisible, hasBeenVisible, observerOptions]);

  return {
    elementRef,
    isVisible,
    hasBeenVisible,
  };
};