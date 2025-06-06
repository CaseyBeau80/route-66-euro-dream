
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
  // ALWAYS start with collapsed state (false) - completely ignore defaultExpanded
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  console.log(`🔧 useCollapsibleState: Initializing for ${sectionKey}-${cardIndex}`, {
    tripId,
    sectionKey,
    cardIndex,
    forcedDefaultExpanded: false, // Always false now
    initialIsExpanded: false
  });

  // Load persisted state from localStorage only if user has interacted before
  useEffect(() => {
    if (tripId) {
      const cardKey = `trip-${tripId}-${sectionKey}-card-${cardIndex}`;
      const interactionKey = `trip-${tripId}-${sectionKey}-interacted`;
      
      const savedState = localStorage.getItem(cardKey);
      const savedInteraction = localStorage.getItem(interactionKey);
      
      console.log(`📂 Loading persisted state for ${sectionKey}-${cardIndex}:`, {
        cardKey,
        savedState,
        savedInteraction,
        currentExpanded: isExpanded
      });
      
      // Only use saved state if user has previously interacted
      if (savedInteraction !== null && JSON.parse(savedInteraction)) {
        setHasUserInteracted(true);
        if (savedState !== null) {
          const parsedState = JSON.parse(savedState);
          console.log(`📂 Setting expanded state from localStorage (user interacted): ${parsedState}`);
          setIsExpanded(parsedState);
        }
      } else {
        // No previous interaction - ensure collapsed and save initial state
        console.log(`📂 No previous interaction, ensuring collapsed: false`);
        setIsExpanded(false);
        localStorage.setItem(cardKey, JSON.stringify(false));
      }
    } else {
      // No tripId, always collapsed
      console.log(`📂 No tripId, using collapsed: false`);
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

  console.log(`🎛️ useCollapsibleState: Current state for ${sectionKey}-${cardIndex}:`, {
    isExpanded,
    hasUserInteracted
  });

  return {
    isExpanded,
    hasUserInteracted,
    handleToggle
  };
};
