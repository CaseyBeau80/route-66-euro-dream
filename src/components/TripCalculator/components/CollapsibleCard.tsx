
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface CollapsibleCardProps {
  children: React.ReactNode;
  title: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  children,
  title,
  defaultExpanded = true,
  className,
  headerClassName,
  contentClassName,
  disabled = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={setIsExpanded}
      disabled={disabled}
      className={cn("w-full", className)}
    >
      <CollapsibleTrigger 
        className={cn(
          "flex items-center justify-between w-full p-4 text-left",
          "hover:bg-gray-50 transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
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

export default CollapsibleCard;
