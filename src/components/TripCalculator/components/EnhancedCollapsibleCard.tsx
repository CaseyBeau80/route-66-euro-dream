
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useCollapsibleState } from '../hooks/useCollapsibleState';

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
  // FORCE COLLAPSED: Always pass false, completely ignore defaultExpanded prop
  const { isExpanded, handleToggle } = useCollapsibleState({
    tripId,
    sectionKey,
    cardIndex,
    defaultExpanded: false // Force collapsed - ignore any defaultExpanded prop
  });

  console.log(`🃏 EnhancedCollapsibleCard: Force collapsed render ${sectionKey}-${cardIndex}`, {
    isExpanded,
    ignoredDefaultExpanded: defaultExpanded, // Log what we're ignoring
    forceCollapsed: true,
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
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500 transition-all duration-200 group-hover:text-gray-700" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 transition-all duration-200 group-hover:text-gray-700" />
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
