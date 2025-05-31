
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface AttractionHoverContextType {
  activeAttraction: string | null;
  hoverPosition: { x: number; y: number };
  setActiveAttraction: (attractionName: string | null, position?: { x: number; y: number }) => void;
  clearAllHovers: () => void;
  keepCardVisible: (attractionName: string) => void;
  shouldShowIndividualMarkers: (zoomLevel: number) => boolean;
  shouldShowClusters: (zoomLevel: number) => boolean;
}

const AttractionHoverContext = createContext<AttractionHoverContextType | undefined>(undefined);

export const AttractionHoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAttraction, setActiveAttractionState] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoveredRef = useRef<string | null>(null);

  // Fixed zoom level logic for clustering behavior
  const shouldShowIndividualMarkers = useCallback((zoomLevel: number): boolean => {
    const threshold = 12; // Show individual markers at zoom 12+
    const show = zoomLevel >= threshold;
    console.log(`🔍 Zoom ${zoomLevel}: Individual markers ${show ? 'VISIBLE' : 'HIDDEN'} (threshold: ${threshold})`);
    return show;
  }, []);

  const shouldShowClusters = useCallback((zoomLevel: number): boolean => {
    const threshold = 12; // Show clusters below zoom 12
    const show = zoomLevel < threshold;
    console.log(`🔍 Zoom ${zoomLevel}: Clusters ${show ? 'VISIBLE' : 'HIDDEN'} (threshold: ${threshold})`);
    return show;
  }, []);

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
      
      console.log(`⏳ Starting hover for attraction: ${attractionName}`);
      
      // Reduced delay for faster response (100ms instead of 300ms)
      showDelayTimeoutRef.current = setTimeout(() => {
        // Double-check the attraction is still being hovered
        if (lastHoveredRef.current === attractionName) {
          console.log(`🎯 Hover activated for attraction: ${attractionName}`);
          setActiveAttractionState(attractionName);
        }
        showDelayTimeoutRef.current = null;
      }, 100);
    } else {
      // Handle mouse leave - shorter delay for attractions (1000ms)
      lastHoveredRef.current = null;
      hoverTimeoutRef.current = setTimeout(() => {
        console.log(`🎯 Hover ended for attraction: ${activeAttraction}`);
        setActiveAttractionState(null);
        hoverTimeoutRef.current = null;
      }, 1000);
    }
  }, [activeAttraction]);

  const keepCardVisible = useCallback((attractionName: string) => {
    // Cancel any pending hide timeout when user hovers over the card
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
      console.log(`🎯 Keeping card visible for attraction: ${attractionName}`);
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
    setActiveAttractionState(null);
  }, []);

  return (
    <AttractionHoverContext.Provider value={{
      activeAttraction,
      hoverPosition,
      setActiveAttraction,
      clearAllHovers,
      keepCardVisible,
      shouldShowIndividualMarkers,
      shouldShowClusters
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
