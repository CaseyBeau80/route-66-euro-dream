
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Route, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp, Map, BarChart3 } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SubStopTimingCard from './SubStopTimingCard';
import StopCard from './StopCard';
import DrivingTimeMessage from './DrivingTimeMessage';
import SegmentMapView from './SegmentMapView';
import SegmentDetailsBreakdown from './SegmentDetailsBreakdown';

interface DaySegmentCardProps {
  segment: DailySegment;
  showAdjustmentWarning?: boolean;
}

const formatDriveTime = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}m`;
  }
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
};

const getRouteSectionColor = (section?: string) => {
  switch (section) {
    case 'Early Route': return 'bg-green-100 text-green-800 border-green-200';
    case 'Mid Route': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Final Stretch': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getDriveTimeBadge = (category?: { category: string; message: string; color: string }) => {
  if (!category) return null;

  const iconMap = {
    short: <CheckCircle className="h-3 w-3" />,
    optimal: <CheckCircle className="h-3 w-3" />,
    long: <Clock className="h-3 w-3" />,
    extreme: <AlertTriangle className="h-3 w-3" />
  };

  const bgColorMap = {
    short: 'bg-green-100 border-green-200',
    optimal: 'bg-blue-100 border-blue-200', 
    long: 'bg-orange-100 border-orange-200',
    extreme: 'bg-red-100 border-red-200'
  };

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${bgColorMap[category.category as keyof typeof bgColorMap]} ${category.color}`}>
      {iconMap[category.category as keyof typeof iconMap]}
      <span className="capitalize">{category.category}</span>
    </div>
  );
};

const DaySegmentCard: React.FC<DaySegmentCardProps> = ({ segment, showAdjustmentWarning = false }) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  console.log('📅 Rendering Enhanced DaySegmentCard:', segment);

  const hasValidTimings = segment.subStopTimings && Array.isArray(segment.subStopTimings) && segment.subStopTimings.length > 0;
  const isLongDriveDay = segment.approximateMiles > 500;

  return (
    <Card className="border-2 border-route66-vintage-brown bg-route66-vintage-beige">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-route66 text-lg text-route66-vintage-red">
            {segment.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {segment.routeSection && (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getRouteSectionColor(segment.routeSection)}`}>
                {segment.routeSection}
              </span>
            )}
            {getDriveTimeBadge(segment.driveTimeCategory)}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-route66-vintage-brown">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{segment.approximateMiles} miles</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>~{formatDriveTime(segment.driveTimeHours)} total</span>
          </div>
          {isLongDriveDay && (
            <div className="flex items-center gap-1 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">Long Drive Day</span>
            </div>
          )}
        </div>

        {/* Drive Time Balance Message */}
        {segment.driveTimeCategory && (
          <div className={`mt-2 p-2 rounded border text-xs ${
            segment.driveTimeCategory.category === 'optimal' ? 'bg-blue-50 border-blue-200 text-blue-800' :
            segment.driveTimeCategory.category === 'short' ? 'bg-green-50 border-green-200 text-green-800' :
            segment.driveTimeCategory.category === 'long' ? 'bg-orange-50 border-orange-200 text-orange-800' :
            'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              <span>{segment.driveTimeCategory.message}</span>
            </div>
          </div>
        )}

        {showAdjustmentWarning && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span className="font-semibold">Trip Duration Adjusted for Balanced Drive Times</span>
            </div>
            <p className="text-xs mt-1">We've optimized your trip duration for consistent daily driving experiences.</p>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Dynamic Driving Time Message */}
          <DrivingTimeMessage driveTimeHours={segment.driveTimeHours} />

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Collapsible open={isMapExpanded} onOpenChange={setIsMapExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  View Route Map
                  {isMapExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <SegmentMapView segment={segment} isExpanded={isMapExpanded} />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={isDetailsExpanded} onOpenChange={setIsDetailsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Detailed Breakdown
                  {isDetailsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <SegmentDetailsBreakdown segment={segment} isExpanded={isDetailsExpanded} />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Route Progression - Show drive times between stops */}
          {hasValidTimings ? (
            <div>
              <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 text-sm flex items-center gap-1">
                <Route className="h-4 w-4" />
                Route Progression ({segment.subStopTimings.length} segments)
              </h4>
              <div className="space-y-1">
                {segment.subStopTimings.map((timing, index) => (
                  <SubStopTimingCard 
                    key={`timing-${segment.day}-${index}-${timing.fromStop.id}-${timing.toStop.id}`} 
                    timing={timing} 
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-route66-vintage-yellow rounded border border-route66-vintage-brown">
              <div className="flex items-center gap-2 text-sm text-route66-vintage-brown">
                <Route className="h-4 w-4" />
                <span className="font-travel font-bold">Direct Route:</span>
                <span>{segment.startCity} → {segment.endCity}</span>
                <span className="text-route66-text-muted">•</span>
                <span>{formatDriveTime(segment.driveTimeHours)}</span>
              </div>
            </div>
          )}

          {/* Recommended Stops Summary */}
          <div>
            <h4 className="font-travel font-bold text-route66-vintage-brown mb-2">
              Recommended Stops ({segment.recommendedStops.length})
            </h4>
            {segment.recommendedStops.length > 0 ? (
              <div className="space-y-2">
                {segment.recommendedStops.slice(0, 3).map((stop) => (
                  <StopCard key={stop.id} stop={stop} />
                ))}
                {segment.recommendedStops.length > 3 && (
                  <div className="text-xs text-route66-vintage-brown italic">
                    +{segment.recommendedStops.length - 3} more stops (view in detailed breakdown)
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-route66-vintage-brown italic">
                Direct drive - no specific stops planned for this segment
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DaySegmentCard;
