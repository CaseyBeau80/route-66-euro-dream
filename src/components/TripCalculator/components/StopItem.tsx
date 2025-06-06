
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ValidatedStop } from './types/stopTypes';
import { getStopIcon, getCategoryColor } from './utils/stopDisplay';

interface StopItemProps {
  stop: ValidatedStop;
  index: number;
}

const StopItem: React.FC<StopItemProps> = ({ stop, index }) => {
  const IconComponent = getStopIcon(stop.category);

  return (
    <div 
      key={stop.id || `stop-${index}`}
      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-route66-border hover:shadow-sm transition-shadow"
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-route66-primary rounded-full flex items-center justify-center text-white">
          <IconComponent className="h-4 w-4" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-route66-text-primary text-sm">
          {stop.name}
        </div>
        
        {(stop.city_name || stop.state) && (
          <div className="text-xs text-route66-text-secondary mt-1">
            {[stop.city_name, stop.state].filter(Boolean).join(', ')}
          </div>
        )}
        
        {stop.category && (
          <Badge 
            variant="outline" 
            className={`text-xs mt-2 ${getCategoryColor(stop.category)}`}
          >
            {stop.category.replace(/_/g, ' ')}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default StopItem;
