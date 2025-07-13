import { useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface UseMobileCardDismissalProps {
  isVisible: boolean;
  onClose: () => void;
  cardId: string;
}

export const useMobileCardDismissal = ({ isVisible, onClose, cardId }: UseMobileCardDismissalProps) => {
  const isMobile = useIsMobile();
  
  console.log(`📱 useMobileCardDismissal - ${cardId}:`, { isMobile, isVisible });

  // Handle map tap dismissal on mobile
  useEffect(() => {
    console.log(`📱 useMobileCardDismissal effect - ${cardId}:`, { isMobile, isVisible });
    if (!isMobile || !isVisible) return;

    const handleMapClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Check if the click was outside any card
      const isCardClick = target.closest(`[data-card-id="${cardId}"]`) !== null;
      const isMarkerClick = target.closest('.gm-style') !== null && 
                           target.closest('[data-card-id]') === null;
      
      if (!isCardClick && !isMarkerClick) {
        console.log(`📱 Map tap detected - closing card: ${cardId}`);
        onClose();
      }
    };

    // Add event listener with a small delay to avoid immediate dismissal
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleMapClick, true);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleMapClick, true);
    };
  }, [isMobile, isVisible, onClose, cardId]);

  return {
    isMobile
  };
};