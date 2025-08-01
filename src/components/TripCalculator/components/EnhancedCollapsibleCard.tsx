
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useCollapsibleState } from '../hooks/useCollapsibleState';
import ItineraryExpandIcon from './ItineraryExpandIcon';

interface EnhancedCollapsibleCardProps {
  children: React.ReactNode;
  title: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
}

const EnhancedCollapsibleCard: React.FC<EnhancedCollapsibleCardProps> = ({
  children,
  title,
  defaultExpanded = false,
  className,
  headerClassName,
  contentClassName,
  disabled = false,
  cardIndex = 0,
  tripId,
  sectionKey = 'default'
}) => {
  // Use the collapsible state hook
  const { isExpanded, handleToggle } = useCollapsibleState({
    tripId,
    sectionKey,
    cardIndex,
    defaultExpanded: false // Start collapsed for better UX
  });

  console.log(`🃏 EnhancedCollapsibleCard: Render ${sectionKey}-${cardIndex}`, {
    isExpanded,
    defaultExpanded,
    tripId
  });

  const onToggle = (newState: boolean) => {
    console.log(`🔄 EnhancedCollapsibleCard: Toggle triggered for ${sectionKey}-${cardIndex}: ${isExpanded} → ${newState}`);
    handleToggle(newState);
    
    // Dispatch event to update collapsed count
    const event = new CustomEvent('cardStateChanged', {
      detail: { sectionKey, cardIndex, expanded: newState }
    });
    window.dispatchEvent(event);
  };

  return (
    <Collapsible 
      open={isExpanded}
      onOpenChange={onToggle}
      disabled={disabled}
      className={cn("w-full", className)}
    >
      <CollapsibleTrigger 
        className={cn(
          "flex items-center justify-between w-full p-4 text-left",
          "hover:bg-gray-50 transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "group",
          headerClassName
        )}
        disabled={disabled}
      >
        <div className="flex-1 min-w-0">
          {title}
        </div>
        <div className="ml-3 flex-shrink-0">
          <ItineraryExpandIcon 
            isExpanded={isExpanded}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(!isExpanded);
            }}
          />
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
