
import { useState, useEffect } from 'react';

interface UseCollapsibleStateProps {
  tripId?: string;
  sectionKey: string;
  cardIndex: number;
  defaultExpanded?: boolean;
}

export const useCollapsibleState = ({
  tripId,
  sectionKey,
  cardIndex,
  defaultExpanded = false
}: UseCollapsibleStateProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Load persisted state from localStorage
  useEffect(() => {
    if (tripId) {
      const savedState = localStorage.getItem(`trip-${tripId}-${sectionKey}-card-${cardIndex}`);
      const savedInteraction = localStorage.getItem(`trip-${tripId}-${sectionKey}-interacted`);
      
      if (savedState !== null) {
        setIsExpanded(JSON.parse(savedState));
      }
      
      if (savedInteraction !== null) {
        setHasUserInteracted(JSON.parse(savedInteraction));
      }
    }
  }, [tripId, sectionKey, cardIndex]);

  // Handle group toggle and auto-expand events
  useEffect(() => {
    const handleToggleAll = (event: CustomEvent) => {
      if (event.detail.sectionKey && event.detail.sectionKey !== sectionKey) return;
      
      setIsExpanded(event.detail.expanded);
      
      if (event.detail.userTriggered) {
        setHasUserInteracted(true);
        
        // Save individual card state
        if (tripId) {
          localStorage.setItem(
            `trip-${tripId}-${sectionKey}-card-${cardIndex}`, 
            JSON.stringify(event.detail.expanded)
          );
        }
      }
    };

    const handleAutoExpandFirst = (event: CustomEvent) => {
      if (event.detail.sectionKey !== sectionKey) return;
      
      // Only expand the first card (index 0) if user hasn't interacted
      if (cardIndex === 0 && !hasUserInteracted) {
        setIsExpanded(true);
        
        // Save the auto-expanded state to localStorage
        if (tripId) {
          localStorage.setItem(`trip-${tripId}-${sectionKey}-card-${cardIndex}`, JSON.stringify(true));
        }
        
        // Dispatch event to update collapsed count immediately
        const updateEvent = new CustomEvent('cardStateChanged', {
          detail: { sectionKey, cardIndex, expanded: true }
        });
        window.dispatchEvent(updateEvent);
      }
    };

    window.addEventListener('toggleAllCards', handleToggleAll as EventListener);
    window.addEventListener('autoExpandFirst', handleAutoExpandFirst as EventListener);
    
    return () => {
      window.removeEventListener('toggleAllCards', handleToggleAll as EventListener);
      window.removeEventListener('autoExpandFirst', handleAutoExpandFirst as EventListener);
    };
  }, [sectionKey, cardIndex, hasUserInteracted, tripId]);

  const handleToggle = (newState: boolean) => {
    setIsExpanded(newState);
    setHasUserInteracted(true);
    
    // Save to localStorage
    if (tripId) {
      localStorage.setItem(`trip-${tripId}-${sectionKey}-card-${cardIndex}`, JSON.stringify(newState));
      localStorage.setItem(`trip-${tripId}-${sectionKey}-interacted`, JSON.stringify(true));
    }
  };

  return {
    isExpanded,
    hasUserInteracted,
    handleToggle
  };
};
