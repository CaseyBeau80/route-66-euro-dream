
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface ItineraryExpandIconProps {
  isExpanded: boolean;
  onClick: () => void;
}

const ItineraryExpandIcon: React.FC<ItineraryExpandIconProps> = ({
  isExpanded,
  onClick
}) => {
  const isMobile = useIsMobile();

  const IconWithAnimation = () => (
    <div className="flex items-center gap-2">
      <ChevronDown 
        className={`h-5 w-5 text-gray-500 transition-all duration-300 ${
          isExpanded ? 'rotate-180' : 'rotate-0'
        } group-hover:text-gray-700`}
      />
      {isMobile && (
        <span className="text-sm font-medium text-gray-600">
          {isExpanded ? 'Hide Details' : 'View Details'}
        </span>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
        aria-label={isExpanded ? 'Hide details' : 'View details'}
      >
        <IconWithAnimation />
      </button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
        >
          <IconWithAnimation />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isExpanded ? 'Collapse details' : 'Expand details'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ItineraryExpandIcon;
