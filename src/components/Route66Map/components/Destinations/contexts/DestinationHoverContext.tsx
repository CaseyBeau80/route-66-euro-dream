
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface DestinationHoverContextType {
  activeDestination: string | null;
  hoverPosition: { x: number; y: number };
  setActiveDestination: (destinationName: string | null, position?: { x: number; y: number }) => void;
  clearAllHovers: () => void;
  keepCardVisible: (destinationName: string) => void;
}

const DestinationHoverContext = createContext<DestinationHoverContextType | undefined>(undefined);

export const DestinationHoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDestination, setActiveDestinationState] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoveredRef = useRef<string | null>(null);

  const setActiveDestination = useCallback((destinationName: string | null, position?: { x: number; y: number }) => {
    // Clear any existing timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
    }

    if (destinationName && position) {
      // Prevent flickering by checking if we're hovering the same destination
      if (lastHoveredRef.current === destinationName && activeDestination === destinationName) {
        // Just update position for same destination
        setHoverPosition(position);
        return;
      }

      // Immediately hide any currently showing destination
      setActiveDestinationState(null);
      lastHoveredRef.current = destinationName;
      
      // Update position
      setHoverPosition(position);
      
      console.log(`⏳ Starting stabilized hover for destination: ${destinationName}`);
      
      // Reduced delay for faster response (300ms)
      showDelayTimeoutRef.current = setTimeout(() => {
        // Double-check the destination is still being hovered
        if (lastHoveredRef.current === destinationName) {
          console.log(`🏛️ Stabilized hover activated for destination: ${destinationName}`);
          setActiveDestinationState(destinationName);
        }
        showDelayTimeoutRef.current = null;
      }, 300);
    } else {
      // Handle mouse leave - longer delay before hiding (2000ms for reading time)
      lastHoveredRef.current = null;
      hoverTimeoutRef.current = setTimeout(() => {
        console.log(`🏛️ Stabilized hover ended for destination: ${activeDestination}`);
        setActiveDestinationState(null);
        hoverTimeoutRef.current = null;
      }, 2000);
    }
  }, [activeDestination]);

  const keepCardVisible = useCallback((destinationName: string) => {
    // Cancel any pending hide timeout when user hovers over the card
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
      console.log(`🏛️ Keeping card visible for destination: ${destinationName}`);
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
    setActiveDestinationState(null);
  }, []);

  return (
    <DestinationHoverContext.Provider value={{
      activeDestination,
      hoverPosition,
      setActiveDestination,
      clearAllHovers,
      keepCardVisible
    }}>
      {children}
    </DestinationHoverContext.Provider>
  );
};

export const useDestinationHoverContext = () => {
  const context = useContext(DestinationHoverContext);
  if (context === undefined) {
    throw new Error('useDestinationHoverContext must be used within a DestinationHoverProvider');
  }
  return context;
};
