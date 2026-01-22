import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface MapFilterItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  tooltip: string;
  checked: boolean;
  onToggle: () => void;
  id: string;
}

const MapFilterItem: React.FC<MapFilterItemProps> = ({
  icon,
  label,
  description,
  tooltip,
  checked,
  onToggle,
  id
}) => {
  const switchId = `filter-switch-${id}`;
  const labelId = `filter-label-${id}`;

  return (
    <div 
      role="group"
      aria-labelledby={labelId}
      className={cn(
        "flex items-start justify-between py-2.5 px-2 rounded-md transition-all duration-200",
        checked ? "opacity-100 bg-amber-50/50" : "opacity-60"
      )}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className={cn(
          "w-6 h-6 flex-shrink-0 flex items-center justify-center transition-all mt-0.5",
          !checked && "grayscale"
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <span 
                id={labelId}
                className={cn(
                  "text-sm font-medium transition-colors cursor-help block",
                  checked ? "text-gray-800" : "text-gray-500"
                )}
              >
                {label}
              </span>
            </TooltipTrigger>
            <TooltipContent 
              side="left" 
              className="max-w-[200px] text-xs bg-gray-900 text-white border-gray-700"
            >
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
          <span className={cn(
            "text-xs leading-tight block mt-0.5 transition-colors",
            checked ? "text-gray-500" : "text-gray-400"
          )}>
            {description}
          </span>
        </div>
      </div>
      <Switch
        id={switchId}
        checked={checked}
        onCheckedChange={onToggle}
        aria-label={`Toggle ${label} layer visibility`}
        className="data-[state=checked]:bg-[#1B60A3] flex-shrink-0 mt-1"
      />
    </div>
  );
};

export default MapFilterItem;
