
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
      // Immediately hide any currently showing attraction
      setActiveAttractionState(null);
      
      // Update position
      setHoverPosition(position);
      
      console.log(`⏳ Starting global hover delay for attraction: ${attractionName}`);
      
      // Add 400ms delay before showing the new card
      showDelayTimeoutRef.current = setTimeout(() => {
        console.log(`🎯 Global hover started for attraction: ${attractionName}`);
        setActiveAttractionState(attractionName);
        showDelayTimeoutRef.current = null;
      }, 400);
    } else {
      // Handle mouse leave - add 300ms delay before hiding
      hoverTimeoutRef.current = setTimeout(() => {
        console.log(`🎯 Global hover ended for attraction: ${activeAttraction}`);
        setActiveAttractionState(null);
        hoverTimeoutRef.current = null;
      }, 300);
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
