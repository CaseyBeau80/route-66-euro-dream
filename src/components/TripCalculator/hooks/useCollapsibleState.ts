
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
  // FORCE COLLAPSED: Always start with false, completely ignore defaultExpanded and localStorage
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  console.log(`🔧 useCollapsibleState: Force collapsed mode for ${sectionKey}-${cardIndex}`, {
    tripId,
    sectionKey,
    cardIndex,
    forceCollapsed: true,
    initialIsExpanded: false
  });

  // Clear localStorage and force collapsed state on initialization
  useEffect(() => {
    if (tripId) {
      const cardKey = `trip-${tripId}-${sectionKey}-card-${cardIndex}`;
      const interactionKey = `trip-${tripId}-${sectionKey}-interacted`;
      
      console.log(`🧹 Clearing localStorage entries for ${sectionKey}-${cardIndex}:`, {
        cardKey,
        interactionKey
      });
      
      // Clear any existing state and force collapsed
      localStorage.removeItem(cardKey);
      localStorage.removeItem(interactionKey);
      localStorage.setItem(cardKey, JSON.stringify(false));
      
      console.log(`🔒 Force setting collapsed state: false`);
      setIsExpanded(false);
      setHasUserInteracted(false);
    } else {
      // No tripId, ensure collapsed
      console.log(`🔒 No tripId, force collapsed: false`);
      setIsExpanded(false);
    }
  }, [tripId, sectionKey, cardIndex]);

  // Handle group toggle events
  useEffect(() => {
    const handleToggleAll = (event: CustomEvent) => {
      if (event.detail.sectionKey && event.detail.sectionKey !== sectionKey) return;
      
      console.log(`🔄 Group toggle received for ${sectionKey}-${cardIndex}:`, event.detail);
      
      setIsExpanded(event.detail.expanded);
      
      if (event.detail.userTriggered) {
        setHasUserInteracted(true);
        
        // Save individual card state
        if (tripId) {
          const cardKey = `trip-${tripId}-${sectionKey}-card-${cardIndex}`;
          const interactionKey = `trip-${tripId}-${sectionKey}-interacted`;
          localStorage.setItem(cardKey, JSON.stringify(event.detail.expanded));
          localStorage.setItem(interactionKey, JSON.stringify(true));
          console.log(`💾 Saved group toggle state: ${cardKey} = ${event.detail.expanded}`);
        }
      }
    };

    window.addEventListener('toggleAllCards', handleToggleAll as EventListener);
    
    return () => {
      window.removeEventListener('toggleAllCards', handleToggleAll as EventListener);
    };
  }, [sectionKey, cardIndex, hasUserInteracted, tripId]);

  const handleToggle = (newState: boolean) => {
    console.log(`🎯 Individual toggle for ${sectionKey}-${cardIndex}: ${isExpanded} → ${newState}`);
    
    setIsExpanded(newState);
    setHasUserInteracted(true);
    
    // Save to localStorage
    if (tripId) {
      const cardKey = `trip-${tripId}-${sectionKey}-card-${cardIndex}`;
      const interactionKey = `trip-${tripId}-${sectionKey}-interacted`;
      
      localStorage.setItem(cardKey, JSON.stringify(newState));
      localStorage.setItem(interactionKey, JSON.stringify(true));
      
      console.log(`💾 Saved individual toggle state: ${cardKey} = ${newState}`);
    }

    // Dispatch event to update collapsed count immediately
    const updateEvent = new CustomEvent('cardStateChanged', {
      detail: { sectionKey, cardIndex, expanded: newState }
    });
    window.dispatchEvent(updateEvent);
  };

  console.log(`🎛️ useCollapsibleState: Final state for ${sectionKey}-${cardIndex}:`, {
    isExpanded,
    hasUserInteracted,
    forceCollapsed: true
  });

  return {
    isExpanded,
    hasUserInteracted,
    handleToggle
  };
};
