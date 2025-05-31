
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface HiddenGemHoverContextType {
  activeGem: string | null;
  hoverPosition: { x: number; y: number };
  setActiveGem: (gemTitle: string | null, position?: { x: number; y: number }) => void;
  clearAllHovers: () => void;
  keepCardVisible: (gemTitle: string) => void;
  isInHoverArea: (x: number, y: number, gemTitle: string) => boolean;
}

const HiddenGemHoverContext = createContext<HiddenGemHoverContextType | undefined>(undefined);

export const HiddenGemHoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeGem, setActiveGemState] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoveredRef = useRef<string | null>(null);
  const positionDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const hoverAreasRef = useRef<Map<string, { x: number; y: number; radius: number }>>(new Map());

  // Hover area collision detection
  const isInHoverArea = useCallback((x: number, y: number, gemTitle: string): boolean => {
    const area = hoverAreasRef.current.get(gemTitle);
    if (!area) return false;
    
    const distance = Math.sqrt(
      Math.pow(x - area.x, 2) + Math.pow(y - area.y, 2)
    );
    
    return distance <= area.radius;
  }, []);

  // Check if position conflicts with any other hover areas
  const hasHoverConflict = useCallback((x: number, y: number, excludeGem?: string): string | null => {
    for (const [gemTitle, area] of hoverAreasRef.current.entries()) {
      if (excludeGem && gemTitle === excludeGem) continue;
      
      const distance = Math.sqrt(
        Math.pow(x - area.x, 2) + Math.pow(y - area.y, 2)
      );
      
      if (distance <= area.radius) {
        return gemTitle;
      }
    }
    return null;
  }, []);

  const setActiveGem = useCallback((gemTitle: string | null, position?: { x: number; y: number }) => {
    // Clear any existing timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
    }
    if (positionDebounceRef.current) {
      clearTimeout(positionDebounceRef.current);
      positionDebounceRef.current = null;
    }

    if (gemTitle && position) {
      // Check for hover area conflicts (hover exclusivity)
      const conflictingGem = hasHoverConflict(position.x, position.y, gemTitle);
      if (conflictingGem && conflictingGem !== activeGem) {
        console.log(`🚫 Hover conflict detected between ${gemTitle} and ${conflictingGem}`);
        return; // Don't proceed if there's a conflict
      }

      // Update hover area for this gem
      hoverAreasRef.current.set(gemTitle, {
        x: position.x,
        y: position.y,
        radius: 60 // Increased hover detection area
      });

      // Prevent flickering by checking if we're hovering the same gem
      if (lastHoveredRef.current === gemTitle && activeGem === gemTitle) {
        // Debounce position updates to prevent flickering
        positionDebounceRef.current = setTimeout(() => {
          setHoverPosition(position);
          console.log(`📍 Debounced position update for ${gemTitle}:`, position);
        }, 50); // 50ms debounce
        return;
      }

      // Immediately hide any currently showing gem (hover exclusivity)
      if (activeGem && activeGem !== gemTitle) {
        setActiveGemState(null);
        hoverAreasRef.current.delete(activeGem);
        console.log(`🔄 Switching from ${activeGem} to ${gemTitle}`);
      }

      lastHoveredRef.current = gemTitle;
      setHoverPosition(position);
      
      console.log(`⏳ Starting hover for hidden gem: ${gemTitle}`);
      
      // Reduced delay for faster response (100ms instead of 300ms)
      showDelayTimeoutRef.current = setTimeout(() => {
        // Double-check the gem is still being hovered
        if (lastHoveredRef.current === gemTitle) {
          console.log(`💎 Hover activated for hidden gem: ${gemTitle}`);
          setActiveGemState(gemTitle);
        }
        showDelayTimeoutRef.current = null;
      }, 100);
    } else {
      // Handle mouse leave
      if (lastHoveredRef.current) {
        hoverAreasRef.current.delete(lastHoveredRef.current);
      }
      lastHoveredRef.current = null;
      
      // Longer delay before hiding for reading time (1500ms)
      hoverTimeoutRef.current = setTimeout(() => {
        console.log(`💎 Hover ended for hidden gem: ${activeGem}`);
        setActiveGemState(null);
        hoverTimeoutRef.current = null;
      }, 1500);
    }
  }, [activeGem, hasHoverConflict]);

  const keepCardVisible = useCallback((gemTitle: string) => {
    // Cancel any pending hide timeout when user hovers over the card
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
      console.log(`💎 Keeping card visible for hidden gem: ${gemTitle}`);
    }
  }, []);

  const clearAllHovers = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
    }
    if (positionDebounceRef.current) {
      clearTimeout(positionDebounceRef.current);
      positionDebounceRef.current = null;
    }
    lastHoveredRef.current = null;
    hoverAreasRef.current.clear();
    setActiveGemState(null);
  }, []);

  return (
    <HiddenGemHoverContext.Provider value={{
      activeGem,
      hoverPosition,
      setActiveGem,
      clearAllHovers,
      keepCardVisible,
      isInHoverArea
    }}>
      {children}
    </HiddenGemHoverContext.Provider>
  );
};

export const useHiddenGemHoverContext = () => {
  const context = useContext(HiddenGemHoverContext);
  if (context === undefined) {
    throw new Error('useHiddenGemHoverContext must be used within a HiddenGemHoverProvider');
  }
  return context;
};
