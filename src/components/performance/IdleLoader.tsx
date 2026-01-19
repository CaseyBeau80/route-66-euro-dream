import { useEffect, useState } from 'react';

// Global flag to force all idle loaders to render immediately
let forceRenderAll = false;
const forceRenderListeners: Set<() => void> = new Set();

export const forceIdleLoaderRender = () => {
  forceRenderAll = true;
  forceRenderListeners.forEach(listener => listener());
};

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
  const [isIdle, setIsIdle] = useState(forceRenderAll);

  useEffect(() => {
    if (forceRenderAll) {
      setIsIdle(true);
      return;
    }

    const listener = () => setIsIdle(true);
    forceRenderListeners.add(listener);

    const scheduleCallback = (window as any).requestIdleCallback || 
      ((cb: () => void) => setTimeout(cb, timeout));

    const id = scheduleCallback(() => {
      setIsIdle(true);
    });

    return () => {
      forceRenderListeners.delete(listener);
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