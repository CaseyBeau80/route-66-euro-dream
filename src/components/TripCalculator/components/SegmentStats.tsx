
import React from 'react';
import { MapPin, Clock, AlertTriangle, Fuel } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUnits } from '@/contexts/UnitContext';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface SegmentStatsProps {
  segment: DailySegment;
  compact?: boolean;
}

const SegmentStats: React.FC<SegmentStatsProps> = ({ segment, compact = false }) => {
  const { formatDistance } = useUnits();
  
  // FIXED: Use the same drive time calculation as TripResults (working preview)
  const drivingTime = segment.drivingTime || segment.driveTimeHours || 0;
  
  // FIXED: Use the same formatTime function as TripResults
  const formatTime = (hours?: number): string => {
    if (!hours) return 'N/A';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  const formattedDriveTime = formatTime(drivingTime);
  
  const isLongDriveDay = segment.approximateMiles > 500;
  const estimatedFuelStops = Math.ceil(segment.approximateMiles / 300);
  const segmentDistance = segment.distance || segment.approximateMiles;

  console.log('📊 FIXED: SegmentStats using SAME logic as working preview:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    drivingTime: segment.drivingTime,
    driveTimeHours: segment.driveTimeHours,
    actualDriveTime: drivingTime,
    formattedDriveTime
  });

  if (compact) {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-4 text-sm text-route66-text-secondary">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{formatDistance(segmentDistance)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formattedDriveTime}</span>
          </div>
          {isLongDriveDay && (
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs">Long Drive</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a long driving day. Plan for extra breaks and fuel stops.</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-3 gap-4 p-3 bg-route66-background-alt rounded-lg border border-route66-accent-light">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-route66-primary" />
          <div>
            <div className="font-medium text-route66-text-primary">{formatDistance(segmentDistance)}</div>
            <div className="text-xs text-route66-text-secondary">Total distance</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-route66-primary" />
          <div>
            <div className="font-medium text-route66-text-primary">{formattedDriveTime}</div>
            <div className="text-xs text-route66-text-secondary">Drive time</div>
          </div>
        </div>
        
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2 text-sm">
              <Fuel className="h-4 w-4 text-route66-primary" />
              <div>
                <div className="font-medium text-route66-text-primary">{estimatedFuelStops}</div>
                <div className="text-xs text-route66-text-secondary">Fuel stops</div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Estimated fuel stops needed (every ~300 miles)</p>
          </TooltipContent>
        </Tooltip>
        
        {isLongDriveDay && (
          <div className="col-span-3 flex items-center gap-2 text-orange-600 text-sm mt-2 pt-2 border-t border-orange-200">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Long Drive Day - Plan extra breaks</span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default SegmentStats;
