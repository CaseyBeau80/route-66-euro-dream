
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface EnhancedCollapsibleCardProps {
  children: React.ReactNode;
  title: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  listenToGroupToggle?: boolean;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
}

const EnhancedCollapsibleCard: React.FC<EnhancedCollapsibleCardProps> = ({
  children,
  title,
  defaultExpanded = false, // Changed default to false
  className,
  headerClassName,
  contentClassName,
  disabled = false,
  listenToGroupToggle = true,
  cardIndex = 0,
  tripId,
  sectionKey
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Load persisted state from localStorage
  useEffect(() => {
    if (tripId && sectionKey) {
      const savedState = localStorage.getItem(`trip-${tripId}-${sectionKey}-card-${cardIndex}`);
      const savedInteraction = localStorage.getItem(`trip-${tripId}-${sectionKey}-interacted`);
      
      if (savedState !== null) {
        setIsExpanded(JSON.parse(savedState));
      }
      
      if (savedInteraction !== null) {
        setHasUserInteracted(JSON.parse(savedInteraction));
      }
    }
  }, [tripId, sectionKey, cardIndex]);

  // Handle group toggle and auto-expand events
  useEffect(() => {
    if (!listenToGroupToggle) return;

    const handleToggleAll = (event: CustomEvent) => {
      if (event.detail.sectionKey && event.detail.sectionKey !== sectionKey) return;
      
      setIsExpanded(event.detail.expanded);
      
      if (event.detail.userTriggered) {
        setHasUserInteracted(true);
        
        // Save individual card state
        if (tripId && sectionKey) {
          localStorage.setItem(
            `trip-${tripId}-${sectionKey}-card-${cardIndex}`, 
            JSON.stringify(event.detail.expanded)
          );
        }
      }
    };

    const handleAutoExpandFirst = (event: CustomEvent) => {
      if (event.detail.sectionKey !== sectionKey) return;
      
      // Only expand the first card (index 0) if user hasn't interacted
      if (cardIndex === 0 && !hasUserInteracted) {
        setIsExpanded(true);
      }
    };

    window.addEventListener('toggleAllCards', handleToggleAll as EventListener);
    window.addEventListener('autoExpandFirst', handleAutoExpandFirst as EventListener);
    
    return () => {
      window.removeEventListener('toggleAllCards', handleToggleAll as EventListener);
      window.removeEventListener('autoExpandFirst', handleAutoExpandFirst as EventListener);
    };
  }, [listenToGroupToggle, sectionKey, cardIndex, hasUserInteracted, tripId]);

  const handleToggle = (newState: boolean) => {
    setIsExpanded(newState);
    setHasUserInteracted(true);
    
    // Save to localStorage
    if (tripId && sectionKey) {
      localStorage.setItem(`trip-${tripId}-${sectionKey}-card-${cardIndex}`, JSON.stringify(newState));
      localStorage.setItem(`trip-${tripId}-${sectionKey}-interacted`, JSON.stringify(true));
    }
  };

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={handleToggle}
      disabled={disabled}
      className={cn("w-full", className)}
    >
      <CollapsibleTrigger 
        className={cn(
          "flex items-center justify-between w-full p-4 text-left",
          "hover:bg-gray-50 transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          headerClassName
        )}
        disabled={disabled}
      >
        <div className="flex-1 min-w-0">
          {title}
        </div>
        <div className="ml-3 flex-shrink-0">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500 transition-transform duration-200" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200" />
          )}
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent 
        className={cn(
          "overflow-hidden",
          "data-[state=closed]:animate-accordion-up",
          "data-[state=open]:animate-accordion-down",
          contentClassName
        )}
      >
        <div className="pb-4 px-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default EnhancedCollapsibleCard;
