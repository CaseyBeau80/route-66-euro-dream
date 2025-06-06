
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, Info, Clock, Calendar } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface SegmentHeaderProps {
  segment: DailySegment;
  showAdjustmentWarning?: boolean;
  tripStartDate?: Date;
  compact?: boolean;
}

const getRouteSectionColor = (section?: string) => {
  switch (section) {
    case 'Early Route': return 'border-green-300 text-green-700 bg-green-50';
    case 'Mid Route': return 'border-blue-300 text-blue-700 bg-blue-50';
    case 'Final Stretch': return 'border-orange-300 text-orange-700 bg-orange-50';
    default: return 'border-gray-300 text-gray-700 bg-gray-50';
  }
};

const getDriveTimeBadge = (category?: { category: string; message: string; color?: string }) => {
  if (!category) return null;

  const colorMap = {
    short: 'border-green-300 text-green-700 bg-green-50',
    optimal: 'border-blue-300 text-blue-700 bg-blue-50', 
    long: 'border-orange-300 text-orange-700 bg-orange-50',
    extreme: 'border-red-300 text-red-700 bg-red-50'
  };

  const badgeColor = colorMap[category.category as keyof typeof colorMap] || 'border-gray-300 text-gray-700 bg-gray-50';

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${badgeColor}`}>
          <Clock className="h-3 w-3" />
          <span className="capitalize">{category.category}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{category.message}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const SegmentHeader: React.FC<SegmentHeaderProps> = ({ 
  segment, 
  showAdjustmentWarning = false, 
  tripStartDate,
  compact = false 
}) => {
  if (compact) {
    return (
      <TooltipProvider>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs font-medium">
              Day {segment.day}
            </Badge>
            <h3 className="font-route66 text-lg text-route66-text-primary font-semibold">
              {segment.startCity} → {segment.endCity}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {segment.routeSection && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getRouteSectionColor(segment.routeSection)}`}
              >
                {segment.routeSection}
              </Badge>
            )}
            {getDriveTimeBadge(segment.driveTimeCategory)}
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-bold">
              Day {segment.day}
            </Badge>
            {tripStartDate && (
              <div className="flex items-center gap-1 text-sm text-route66-text-secondary">
                <Calendar className="h-4 w-4" />
                <span>Date info here</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {segment.routeSection && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getRouteSectionColor(segment.routeSection)}`}
              >
                {segment.routeSection}
              </Badge>
            )}
            {getDriveTimeBadge(segment.driveTimeCategory)}
          </div>
        </div>

        <h3 className="font-route66 text-xl text-route66-primary font-bold">
          {segment.title || `${segment.startCity} → ${segment.endCity}`}
        </h3>

        {/* Drive Time Balance Message - Compact */}
        {segment.driveTimeCategory && (
          <div className={`p-3 rounded-lg border text-sm ${
            segment.driveTimeCategory.category === 'optimal' ? 'bg-blue-50 border-blue-200 text-blue-800' :
            segment.driveTimeCategory.category === 'short' ? 'bg-green-50 border-green-200 text-green-800' :
            segment.driveTimeCategory.category === 'long' ? 'bg-orange-50 border-orange-200 text-orange-800' :
            'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="font-medium">{segment.driveTimeCategory.message}</span>
            </div>
          </div>
        )}

        {showAdjustmentWarning && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-semibold">Trip Duration Adjusted for Balanced Drive Times</span>
            </div>
            <p className="text-xs mt-1">We've optimized your trip duration for consistent daily driving experiences.</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default SegmentHeader;
