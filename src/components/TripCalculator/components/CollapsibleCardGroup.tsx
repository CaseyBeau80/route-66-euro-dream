
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

  // Load persisted state from localStorage
  useEffect(() => {
    if (tripId) {
      const savedState = localStorage.getItem(`trip-${tripId}-${sectionKey}-expanded`);
      const savedInteraction = localStorage.getItem(`trip-${tripId}-${sectionKey}-interacted`);
      
      if (savedState !== null) {
        setAllExpanded(JSON.parse(savedState));
      }
      
      if (savedInteraction !== null) {
        setHasUserInteracted(JSON.parse(savedInteraction));
      }
    }
  }, [tripId, sectionKey]);

  // Calculate collapsed count from localStorage
  const calculateCollapsedCount = () => {
    if (tripId && totalCards > 0) {
      let collapsed = 0;
      for (let i = 0; i < totalCards; i++) {
        const cardState = localStorage.getItem(`trip-${tripId}-${sectionKey}-card-${i}`);
        if (cardState === null || !JSON.parse(cardState)) {
          collapsed++;
        }
      }
      return collapsed;
    }
    return totalCards;
  };

  // Initial collapsed count calculation
  useEffect(() => {
    setCollapsedCount(calculateCollapsedCount());
  }, [tripId, sectionKey, totalCards]);

  // Listen for card state changes to update collapsed count
  useEffect(() => {
    const handleCardStateChange = (event: CustomEvent) => {
      if (event.detail.sectionKey !== sectionKey) return;
      
      // Recalculate collapsed count from localStorage
      const newCollapsedCount = calculateCollapsedCount();
      setCollapsedCount(newCollapsedCount);
      setAllExpanded(newCollapsedCount === 0);
    };

    window.addEventListener('cardStateChanged', handleCardStateChange as EventListener);
    
    return () => {
      window.removeEventListener('cardStateChanged', handleCardStateChange as EventListener);
    };
  }, [tripId, sectionKey, totalCards]);

  const handleToggleAll = () => {
    const newExpandedState = !allExpanded;
    setAllExpanded(newExpandedState);
    setHasUserInteracted(true);
    setCollapsedCount(newExpandedState ? 0 : totalCards);

    // Save to localStorage
    if (tripId) {
      localStorage.setItem(`trip-${tripId}-${sectionKey}-expanded`, JSON.stringify(newExpandedState));
      localStorage.setItem(`trip-${tripId}-${sectionKey}-interacted`, JSON.stringify(true));
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
