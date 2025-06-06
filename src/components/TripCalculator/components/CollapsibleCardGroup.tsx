
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleCardGroupProps {
  children: React.ReactNode;
  showToggleAll?: boolean;
  className?: string;
  tripId?: string;
  sectionKey: string; // 'itinerary' or 'weather'
  autoExpandFirstOnDesktop?: boolean;
}

const CollapsibleCardGroup: React.FC<CollapsibleCardGroupProps> = ({
  children,
  showToggleAll = true,
  className,
  tripId,
  sectionKey,
  autoExpandFirstOnDesktop = false
}) => {
  const [allExpanded, setAllExpanded] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

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

  // Auto-expand Day 1 on desktop if user hasn't interacted
  useEffect(() => {
    if (autoExpandFirstOnDesktop && !hasUserInteracted && window.innerWidth >= 768) {
      // Dispatch event to expand only the first card
      const event = new CustomEvent('autoExpandFirst', { 
        detail: { sectionKey } 
      });
      window.dispatchEvent(event);
    }
  }, [autoExpandFirstOnDesktop, hasUserInteracted, sectionKey]);

  const handleToggleAll = () => {
    const newExpandedState = !allExpanded;
    setAllExpanded(newExpandedState);
    setHasUserInteracted(true);

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
      <div className="flex justify-end mb-4">
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
