
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface HiddenGemHoverContextType {
  activeGem: string | null;
  hoverPosition: { x: number; y: number };
  setActiveGem: (gemTitle: string | null, position?: { x: number; y: number }) => void;
  clearAllHovers: () => void;
  keepCardVisible: (gemTitle: string) => void;
}

const HiddenGemHoverContext = createContext<HiddenGemHoverContextType | undefined>(undefined);

export const HiddenGemHoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeGem, setActiveGemState] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoveredRef = useRef<string | null>(null);

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

    if (gemTitle && position) {
      // Prevent flickering by checking if we're hovering the same gem
      if (lastHoveredRef.current === gemTitle && activeGem === gemTitle) {
        // Just update position for same gem
        setHoverPosition(position);
        return;
      }

      // Immediately hide any currently showing gem
      setActiveGemState(null);
      lastHoveredRef.current = gemTitle;
      
      // Update position
      setHoverPosition(position);
      
      console.log(`⏳ Starting stabilized hover for hidden gem: ${gemTitle}`);
      
      // Reduced delay for faster response (300ms)
      showDelayTimeoutRef.current = setTimeout(() => {
        // Double-check the gem is still being hovered
        if (lastHoveredRef.current === gemTitle) {
          console.log(`💎 Stabilized hover activated for hidden gem: ${gemTitle}`);
          setActiveGemState(gemTitle);
        }
        showDelayTimeoutRef.current = null;
      }, 300);
    } else {
      // Handle mouse leave - longer delay before hiding (2000ms for reading time)
      lastHoveredRef.current = null;
      hoverTimeoutRef.current = setTimeout(() => {
        console.log(`💎 Stabilized hover ended for hidden gem: ${activeGem}`);
        setActiveGemState(null);
        hoverTimeoutRef.current = null;
      }, 2000);
    }
  }, [activeGem]);

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
    lastHoveredRef.current = null;
    setActiveGemState(null);
  }, []);

  return (
    <HiddenGemHoverContext.Provider value={{
      activeGem,
      hoverPosition,
      setActiveGem,
      clearAllHovers,
      keepCardVisible
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
