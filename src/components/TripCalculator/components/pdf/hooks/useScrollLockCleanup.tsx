import { useEffect } from 'react';

/**
 * Hook that provides emergency scroll unlock functionality
 * Prevents the page from getting stuck with scroll locked
 */
export const useScrollLockCleanup = () => {
  useEffect(() => {
    const forceUnlock = () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.position = '';
      document.body.removeAttribute('data-scroll-locked');
    };

    // Immediate unlock
    forceUnlock();
    
    // Also set up a single interval for safety
    const interval = setInterval(forceUnlock, 1000);
    
    return () => {
      clearInterval(interval);
      forceUnlock();
    };
  }, []);

  const forceScrollUnlock = () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.position = '';
    document.body.removeAttribute('data-scroll-locked');
  };

  return { forceScrollUnlock };
};