
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface AttractionHoverContextType {
  activeAttraction: string | null;
  hoverPosition: { x: number; y: number };
  setActiveAttraction: (attractionName: string | null, position?: { x: number; y: number }) => void;
  clearAllHovers: () => void;
}

const AttractionHoverContext = createContext<AttractionHoverContextType | undefined>(undefined);

export const AttractionHoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAttraction, setActiveAttractionState] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoveredRef = useRef<string | null>(null);

  const setActiveAttraction = useCallback((attractionName: string | null, position?: { x: number; y: number }) => {
    // Clear any existing timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
    }

    if (attractionName && position) {
      // Prevent flickering by checking if we're hovering the same attraction
      if (lastHoveredRef.current === attractionName && activeAttraction === attractionName) {
        // Just update position for same attraction
        setHoverPosition(position);
        return;
      }

      // Immediately hide any currently showing attraction
      setActiveAttractionState(null);
      lastHoveredRef.current = attractionName;
      
      // Update position
      setHoverPosition(position);
      
      console.log(`⏳ Starting stabilized hover for attraction: ${attractionName}`);
      
      // Add longer delay to prevent flickering (600ms instead of 400ms)
      showDelayTimeoutRef.current = setTimeout(() => {
        // Double-check the attraction is still being hovered
        if (lastHoveredRef.current === attractionName) {
          console.log(`🎯 Stabilized hover activated for attraction: ${attractionName}`);
          setActiveAttractionState(attractionName);
        }
        showDelayTimeoutRef.current = null;
      }, 600);
    } else {
      // Handle mouse leave - add longer delay before hiding (500ms instead of 300ms)
      lastHoveredRef.current = null;
      hoverTimeoutRef.current = setTimeout(() => {
        console.log(`🎯 Stabilized hover ended for attraction: ${activeAttraction}`);
        setActiveAttractionState(null);
        hoverTimeoutRef.current = null;
      }, 500);
    }
  }, [activeAttraction]);

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
    setActiveAttractionState(null);
  }, []);

  return (
    <AttractionHoverContext.Provider value={{
      activeAttraction,
      hoverPosition,
      setActiveAttraction,
      clearAllHovers
    }}>
      {children}
    </AttractionHoverContext.Provider>
  );
};

export const useAttractionHoverContext = () => {
  const context = useContext(AttractionHoverContext);
  if (context === undefined) {
    throw new Error('useAttractionHoverContext must be used within an AttractionHoverProvider');
  }
  return context;
};
