
import { useState, useEffect, useRef, useCallback } from 'react';

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
  // FORCE COLLAPSED: Always start with false, completely ignore defaultExpanded
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Prevent event spam with refs
  const eventThrottleRef = useRef<NodeJS.Timeout>();
  const lastEventTimeRef = useRef<number>(0);

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
      
      console.log(`🧹 Clearing localStorage entries for ${sectionKey}-${cardIndex}`);
      
      // Clear any existing state and force collapsed
      localStorage.removeItem(cardKey);
      localStorage.removeItem(interactionKey);
      localStorage.setItem(cardKey, JSON.stringify(false));
      
      setIsExpanded(false);
      setHasUserInteracted(false);
    } else {
      setIsExpanded(false);
    }
  }, [tripId, sectionKey, cardIndex]);

  // Throttled event handler to prevent spam
  const handleToggleAll = useCallback((event: CustomEvent) => {
    const now = Date.now();
    const timeSinceLastEvent = now - lastEventTimeRef.current;
    
    // Throttle events to max 1 per 100ms
    if (timeSinceLastEvent < 100) {
      console.log(`🚫 Event throttled for ${sectionKey}-${cardIndex}`);
      return;
    }
    
    if (event.detail.sectionKey && event.detail.sectionKey !== sectionKey) return;
    
    console.log(`🔄 Group toggle received for ${sectionKey}-${cardIndex}:`, event.detail);
    
    lastEventTimeRef.current = now;
    setIsExpanded(event.detail.expanded);
    
    if (event.detail.userTriggered) {
      setHasUserInteracted(true);
      
      // Debounce localStorage writes
      if (eventThrottleRef.current) {
        clearTimeout(eventThrottleRef.current);
      }
      
      eventThrottleRef.current = setTimeout(() => {
        if (tripId) {
          const cardKey = `trip-${tripId}-${sectionKey}-card-${cardIndex}`;
          const interactionKey = `trip-${tripId}-${sectionKey}-interacted`;
          localStorage.setItem(cardKey, JSON.stringify(event.detail.expanded));
          localStorage.setItem(interactionKey, JSON.stringify(true));
          console.log(`💾 Saved group toggle state: ${cardKey} = ${event.detail.expanded}`);
        }
      }, 50);
    }
  }, [sectionKey, cardIndex, hasUserInteracted, tripId]);

  useEffect(() => {
    window.addEventListener('toggleAllCards', handleToggleAll as EventListener);
    
    return () => {
      window.removeEventListener('toggleAllCards', handleToggleAll as EventListener);
      if (eventThrottleRef.current) {
        clearTimeout(eventThrottleRef.current);
      }
    };
  }, [handleToggleAll]);

  const handleToggle = useCallback((newState: boolean) => {
    console.log(`🎯 Individual toggle for ${sectionKey}-${cardIndex}: ${isExpanded} → ${newState}`);
    
    setIsExpanded(newState);
    setHasUserInteracted(true);
    
    // Debounce localStorage and event dispatching
    if (eventThrottleRef.current) {
      clearTimeout(eventThrottleRef.current);
    }
    
    eventThrottleRef.current = setTimeout(() => {
      // Save to localStorage
      if (tripId) {
        const cardKey = `trip-${tripId}-${sectionKey}-card-${cardIndex}`;
        const interactionKey = `trip-${tripId}-${sectionKey}-interacted`;
        
        localStorage.setItem(cardKey, JSON.stringify(newState));
        localStorage.setItem(interactionKey, JSON.stringify(true));
        
        console.log(`💾 Saved individual toggle state: ${cardKey} = ${newState}`);
      }

      // Dispatch event to update collapsed count
      const updateEvent = new CustomEvent('cardStateChanged', {
        detail: { sectionKey, cardIndex, expanded: newState }
      });
      window.dispatchEvent(updateEvent);
    }, 50);
  }, [isExpanded, sectionKey, cardIndex, tripId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventThrottleRef.current) {
        clearTimeout(eventThrottleRef.current);
      }
    };
  }, []);

  return {
    isExpanded,
    hasUserInteracted,
    handleToggle
  };
};
