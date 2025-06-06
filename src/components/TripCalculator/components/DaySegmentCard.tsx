
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, MapPin, Route, AlertTriangle, Calendar } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentRouteProgression from './SegmentRouteProgression';
import SegmentRecommendedStops from './SegmentRecommendedStops';

interface DaySegmentCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
}

const DaySegmentCard: React.FC<DaySegmentCardProps> = ({ 
  segment, 
  tripStartDate 
}) => {
  console.log('🗓️ DaySegmentCard render:', segment.title);

  // Calculate the date for this segment
  const getSegmentDate = () => {
    if (tripStartDate) {
      return addDays(tripStartDate, segment.day - 1);
    }
    return null;
  };

  const segmentDate = getSegmentDate();

  // Get drive time category styling
  const getDriveTimeStyle = () => {
    if (!segment.driveTimeCategory) return { 
      bg: 'bg-gray-100', 
      text: 'text-gray-700', 
      border: 'border-gray-300' 
    };
    
    switch (segment.driveTimeCategory.category) {
      case 'short':
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
      case 'optimal':
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
      case 'long':
        return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' };
      case 'extreme':
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    }
  };

  const driveTimeStyle = getDriveTimeStyle();

  // Format drive time
  const formatDriveTime = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  return (
    <TooltipProvider>
      <Card className="border border-route66-border shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="space-y-4">
            {/* Streamlined Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <Badge variant="outline" className="text-xs font-medium border-route66-border">
                    Day {segment.day}
                  </Badge>
                  {segmentDate && (
                    <div className="flex items-center gap-1 text-xs text-route66-text-secondary">
                      <Calendar className="h-3 w-3" />
                      {format(segmentDate, 'EEE, MMM d')}
                    </div>
                  )}
                </div>
                <h3 className="font-route66 text-lg text-route66-text-primary font-semibold truncate">
                  {segment.startCity} → {segment.endCity}
                </h3>
              </div>
              
              {/* Right-aligned tags */}
              <div className="flex items-center gap-2 ml-4">
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

            {/* Compact Stats Row */}
            <div className="flex items-center gap-4 text-sm text-route66-text-secondary py-2">
              <div className="flex items-center gap-1">
                <Route className="h-4 w-4" />
                <span>{Math.round(segment.distance || segment.approximateMiles)} miles</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className={segment.driveTimeHours > 7 ? driveTimeStyle.text : ''}>
                  {formatDriveTime(segment.driveTimeHours)} driving
                </span>
              </div>
              {segment.driveTimeHours > 7 && (
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-medium">Long Drive Day</span>
                </div>
              )}
            </div>

            {/* Drive Time Message - Compact */}
            {segment.driveTimeCategory && segment.driveTimeHours > 6 && (
              <div className={`p-3 rounded-lg border text-sm ${driveTimeStyle.bg} ${driveTimeStyle.border}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${driveTimeStyle.text}`} />
                  <div>
                    <div className={`font-medium text-sm ${driveTimeStyle.text}`}>
                      {segment.driveTimeCategory.category.charAt(0).toUpperCase() + segment.driveTimeCategory.category.slice(1)} Drive Day
                    </div>
                    <div className={`text-xs mt-1 ${driveTimeStyle.text}`}>
                      {segment.driveTimeCategory.message}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommended Stops */}
            <SegmentRecommendedStops segment={segment} />

            {/* Route Progression */}
            <SegmentRouteProgression segment={segment} />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default DaySegmentCard;
