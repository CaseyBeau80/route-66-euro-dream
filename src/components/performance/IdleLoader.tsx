import { useEffect, useState } from 'react';

/**
 * Hook that defers execution until the browser is idle
 * Reduces JavaScript execution time during critical rendering
 */
export const useIdleCallback = (callback: () => void, deps: any[] = []) => {
  useEffect(() => {
    // Use requestIdleCallback if available, otherwise setTimeout
    const scheduleCallback = (window as any).requestIdleCallback || 
      ((cb: () => void) => setTimeout(cb, 100));

    const cancelCallback = (window as any).cancelIdleCallback || clearTimeout;

    const id = scheduleCallback(() => {
      callback();
    });

    return () => cancelCallback(id);
  }, deps);
};

/**
 * Hook that returns true when the browser is idle
 */
export const useIsIdle = (timeout: number = 100) => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    const scheduleCallback = (window as any).requestIdleCallback || 
      ((cb: () => void) => setTimeout(cb, timeout));

    const id = scheduleCallback(() => {
      setIsIdle(true);
    });

    return () => {
      const cancelCallback = (window as any).cancelIdleCallback || clearTimeout;
      cancelCallback(id);
    };
  }, [timeout]);

  return isIdle;
};

/**
 * Component that renders children only when browser is idle
 */
interface IdleLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  timeout?: number;
}

export const IdleLoader: React.FC<IdleLoaderProps> = ({
  children,
  fallback = null,
  timeout = 100
}) => {
  const isIdle = useIsIdle(timeout);

  return <>{isIdle ? children : fallback}</>;
};