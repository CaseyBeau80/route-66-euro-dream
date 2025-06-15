
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface DaySegmentCardHeaderProps {
  segment: DailySegment;
  segmentDate?: Date | null;
  driveTimeStyle: {
    bg: string;
    text: string;
    border: string;
  };
}

const DaySegmentCardHeader: React.FC<DaySegmentCardHeaderProps> = ({
  segment,
  segmentDate,
  driveTimeStyle
}) => {
  return (
    <div className="space-y-3">
      {/* Consistent Header Format: Day X • City Name */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-medium border-route66-border">
            Day {segment.day}
          </Badge>
          <span className="text-gray-300">•</span>
          <h4 className="font-route66 text-base text-route66-text-primary font-semibold">
            {segment.endCity}
          </h4>
        </div>
        
        <div className="flex items-center gap-2">
          {segmentDate && (
            <div className="flex items-center gap-1 text-xs text-route66-text-secondary">
              <Calendar className="h-3 w-3" />
              {format(segmentDate, 'EEE, MMM d')}
            </div>
          )}
          
          {segment.routeSection && (
            <Tooltip>
              <TooltipTrigger>
                <Badge 
                  variant="outline" 
                  className="text-xs border-route66-accent-light text-route66-text-secondary"
                >
                  {segment.routeSection}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Route section on historic Route 66</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {/* Drive Time Status Pill */}
          {segment.driveTimeCategory && (
            <Tooltip>
              <TooltipTrigger>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${driveTimeStyle.bg} ${driveTimeStyle.text} ${driveTimeStyle.border}`}>
                  <Clock className="h-3 w-3" />
                  <span className="capitalize">{segment.driveTimeCategory.category}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{segment.driveTimeCategory.message}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Route Title with Consistent Format */}
      <h5 className="font-route66 text-sm text-route66-text-primary font-medium">
        {segment.startCity} → {segment.endCity}
      </h5>
    </div>
  );
};

export default DaySegmentCardHeader;
