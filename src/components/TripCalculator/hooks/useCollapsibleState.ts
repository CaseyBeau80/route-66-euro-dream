
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

  console.log(`🔧 useCollapsibleState: Initializing for ${sectionKey}-${cardIndex}`, {
    tripId,
    sectionKey,
    cardIndex,
    defaultExpanded,
    initialIsExpanded: isExpanded
  });

  // Load persisted state from localStorage
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
      
      // If there's saved state, use it; otherwise use defaultExpanded (false)
      if (savedState !== null) {
        const parsedState = JSON.parse(savedState);
        console.log(`📂 Setting expanded state from localStorage: ${parsedState}`);
        setIsExpanded(parsedState);
      } else {
        // Ensure we start with the correct default (collapsed)
        console.log(`📂 No saved state, using default: ${defaultExpanded}`);
        setIsExpanded(defaultExpanded);
        // Save the initial state
        localStorage.setItem(cardKey, JSON.stringify(defaultExpanded));
      }
      
      if (savedInteraction !== null) {
        setHasUserInteracted(JSON.parse(savedInteraction));
      }
    } else {
      // No tripId, just use the default
      console.log(`📂 No tripId, using default expanded: ${defaultExpanded}`);
      setIsExpanded(defaultExpanded);
    }
  }, [tripId, sectionKey, cardIndex, defaultExpanded]);

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
          localStorage.setItem(cardKey, JSON.stringify(event.detail.expanded));
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

  // Clean up stale localStorage entries on mount
  useEffect(() => {
    if (tripId) {
      // Clean up any entries that might be corrupted or from old versions
      const cardKey = `trip-${tripId}-${sectionKey}-card-${cardIndex}`;
      const savedState = localStorage.getItem(cardKey);
      
      if (savedState !== null) {
        try {
          JSON.parse(savedState);
        } catch (error) {
          console.warn(`🧹 Cleaning up corrupted localStorage entry: ${cardKey}`);
          localStorage.removeItem(cardKey);
          setIsExpanded(defaultExpanded);
        }
      }
    }
  }, [tripId, sectionKey, cardIndex, defaultExpanded]);

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
