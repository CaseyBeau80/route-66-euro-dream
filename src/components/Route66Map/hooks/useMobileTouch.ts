import { useCallback, useEffect, useRef } from 'react';

interface UseMobileTouchProps {
  onShow: () => void;
  onHide: () => void;
  itemName: string;
}

export const useMobileTouch = ({ onShow, onHide, itemName }: UseMobileTouchProps) => {
  const touchStartTimeRef = useRef<number>(0);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleTouchStart = useCallback(() => {
    touchStartTimeRef.current = Date.now();
  }, []);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    const touchDuration = Date.now() - touchStartTimeRef.current;
    
    // Only handle as tap if it was a short touch (not a scroll)
    if (touchDuration < 200) {
      console.log(`📱 Mobile tap detected on ${itemName}`);
      event.preventDefault();
      event.stopPropagation();
      onShow();
    }
  }, [onShow, itemName]);

  const handleClick = useCallback((event: Event) => {
    if (isMobile) {
      // On mobile, prevent default click and handle via touch
      event.preventDefault();
      event.stopPropagation();
    }
  }, [isMobile]);

  return {
    isMobile,
    handleTouchStart,
    handleTouchEnd,
    handleClick
  };
};