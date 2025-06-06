
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleCardGroupProps {
  children: React.ReactNode;
  showToggleAll?: boolean;
  className?: string;
}

const CollapsibleCardGroup: React.FC<CollapsibleCardGroupProps> = ({
  children,
  showToggleAll = true,
  className
}) => {
  const [allExpanded, setAllExpanded] = useState(true);

  const handleToggleAll = () => {
    setAllExpanded(!allExpanded);
    // Dispatch custom event to notify all collapsible cards
    const event = new CustomEvent('toggleAllCards', { 
      detail: { expanded: !allExpanded } 
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
