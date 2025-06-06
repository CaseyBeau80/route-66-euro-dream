
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleCardGroupProps {
  children: React.ReactNode;
  showToggleAll?: boolean;
  className?: string;
  tripId?: string;
  sectionKey: string;
  totalCards?: number;
}

const CollapsibleCardGroup: React.FC<CollapsibleCardGroupProps> = ({
  children,
  showToggleAll = true,
  className,
  tripId,
  sectionKey,
  totalCards = 0
}) => {
  const [allExpanded, setAllExpanded] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [collapsedCount, setCollapsedCount] = useState(totalCards);

  console.log(`📊 CollapsibleCardGroup: Initializing ${sectionKey}`, {
    tripId,
    sectionKey,
    totalCards,
    initialCollapsedCount: collapsedCount
  });

  // Calculate collapsed count from localStorage or default state
  const calculateCollapsedCount = () => {
    if (tripId && totalCards > 0) {
      let collapsed = 0;
      for (let i = 0; i < totalCards; i++) {
        const cardState = localStorage.getItem(`trip-${tripId}-${sectionKey}-card-${i}`);
        // If no saved state exists, card should be collapsed (default: false)
        // If saved state exists, parse it
        const isExpanded = cardState !== null ? JSON.parse(cardState) : false;
        if (!isExpanded) {
          collapsed++;
        }
      }
      console.log(`📊 Calculated collapsed count for ${sectionKey}: ${collapsed}/${totalCards}`);
      return collapsed;
    }
    // If no tripId, all cards start collapsed
    return totalCards;
  };

  // Load persisted state from localStorage
  useEffect(() => {
    if (tripId) {
      const savedState = localStorage.getItem(`trip-${tripId}-${sectionKey}-expanded`);
      const savedInteraction = localStorage.getItem(`trip-${tripId}-${sectionKey}-interacted`);
      
      console.log(`📂 Loading group state for ${sectionKey}:`, {
        savedState,
        savedInteraction
      });
      
      if (savedState !== null) {
        setAllExpanded(JSON.parse(savedState));
      }
      
      if (savedInteraction !== null) {
        setHasUserInteracted(JSON.parse(savedInteraction));
      }
    }
  }, [tripId, sectionKey]);

  // Initial collapsed count calculation and cleanup
  useEffect(() => {
    // Clean up any corrupted localStorage entries first
    if (tripId && totalCards > 0) {
      for (let i = 0; i < totalCards; i++) {
        const cardKey = `trip-${tripId}-${sectionKey}-card-${i}`;
        const cardState = localStorage.getItem(cardKey);
        
        if (cardState !== null) {
          try {
            JSON.parse(cardState);
          } catch (error) {
            console.warn(`🧹 Cleaning up corrupted localStorage entry: ${cardKey}`);
            localStorage.removeItem(cardKey);
          }
        }
      }
    }
    
    // Calculate the actual collapsed count
    const newCollapsedCount = calculateCollapsedCount();
    setCollapsedCount(newCollapsedCount);
    setAllExpanded(newCollapsedCount === 0);
    
    console.log(`📊 Initial state calculated for ${sectionKey}:`, {
      collapsedCount: newCollapsedCount,
      allExpanded: newCollapsedCount === 0
    });
  }, [tripId, sectionKey, totalCards]);

  // Listen for card state changes to update collapsed count
  useEffect(() => {
    const handleCardStateChange = (event: CustomEvent) => {
      if (event.detail.sectionKey !== sectionKey) return;
      
      console.log(`📊 Card state change detected for ${sectionKey}:`, event.detail);
      
      // Recalculate collapsed count from localStorage
      const newCollapsedCount = calculateCollapsedCount();
      setCollapsedCount(newCollapsedCount);
      setAllExpanded(newCollapsedCount === 0);
      
      console.log(`📊 Updated group state for ${sectionKey}:`, {
        collapsedCount: newCollapsedCount,
        allExpanded: newCollapsedCount === 0
      });
    };

    window.addEventListener('cardStateChanged', handleCardStateChange as EventListener);
    
    return () => {
      window.removeEventListener('cardStateChanged', handleCardStateChange as EventListener);
    };
  }, [tripId, sectionKey, totalCards]);

  const handleToggleAll = () => {
    const newExpandedState = !allExpanded;
    console.log(`🔄 Toggle all for ${sectionKey}: ${allExpanded} → ${newExpandedState}`);
    
    setAllExpanded(newExpandedState);
    setHasUserInteracted(true);
    setCollapsedCount(newExpandedState ? 0 : totalCards);

    // Save to localStorage
    if (tripId) {
      localStorage.setItem(`trip-${tripId}-${sectionKey}-expanded`, JSON.stringify(newExpandedState));
      localStorage.setItem(`trip-${tripId}-${sectionKey}-interacted`, JSON.stringify(true));
      
      console.log(`💾 Saved group toggle state for ${sectionKey}: expanded=${newExpandedState}`);
    }

    // Dispatch custom event to notify all collapsible cards
    const event = new CustomEvent('toggleAllCards', { 
      detail: { 
        expanded: newExpandedState,
        sectionKey,
        userTriggered: true
      } 
    });
    window.dispatchEvent(event);
  };

  if (!showToggleAll) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {collapsedCount > 0 && totalCards > 0 && (
            <span>{collapsedCount} of {totalCards} collapsed</span>
          )}
          {collapsedCount === 0 && totalCards > 0 && (
            <span>All expanded</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleAll}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          {allExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Collapse All
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Expand All
            </>
          )}
        </Button>
      </div>
      {children}
    </div>
  );
};

export default CollapsibleCardGroup;
