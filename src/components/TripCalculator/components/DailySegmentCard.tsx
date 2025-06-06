
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Route, AlertTriangle } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import DrivingTimeMessage from './DrivingTimeMessage';
import SegmentHeader from './SegmentHeader';
import SegmentStats from './SegmentStats';
import SegmentActionButtons from './SegmentActionButtons';
import SegmentRouteProgression from './SegmentRouteProgression';

interface DaySegmentCardProps {
  segment: DailySegment;
  showAdjustmentWarning?: boolean;
  tripStartDate?: Date;
}

const DaySegmentCard: React.FC<DaySegmentCardProps> = ({ 
  segment, 
  showAdjustmentWarning = false, 
  tripStartDate 
}) => {
  const [isWeatherExpanded, setIsWeatherExpanded] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Calculate the date for this segment
  const getSegmentDate = () => {
    if (tripStartDate) {
      return addDays(tripStartDate, segment.day - 1);
    }
    return null;
  };

  const segmentDate = getSegmentDate();

  // Get drive time category colors
  const getDriveTimeColors = () => {
    if (!segment.driveTimeCategory) return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' };
    
    switch (segment.driveTimeCategory.category) {
      case 'short':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' };
      case 'optimal':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' };
      case 'long':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800' };
      case 'extreme':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' };
    }
  };

  const colors = getDriveTimeColors();

  console.log('📅 Rendering Enhanced DaySegmentCard with drive time colors:', {
    segment: segment.title,
    driveTimeCategory: segment.driveTimeCategory,
    colors,
    recommendedStops: segment.recommendedStops?.length || 0
  });

  return (
    <Card className={`border-2 ${colors.border} ${colors.bg}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-bold">
              Day {segment.day}
            </Badge>
            {segmentDate && (
              <div className="text-sm text-gray-600">
                {format(segmentDate, 'EEE, MMM d')}
              </div>
            )}
          </div>
          
          {/* Drive Time Category Badge */}
          {segment.driveTimeCategory && (
            <Badge 
              variant="secondary" 
              className={`${colors.bg} ${colors.border} ${colors.text} flex items-center gap-1`}
            >
              <Clock className="h-3 w-3" />
              <span className="capitalize">{segment.driveTimeCategory.category}</span>
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-route66 text-lg text-route66-vintage-red">
            {segment.startCity} → {segment.endCity}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-route66-text-secondary">
            <div className="flex items-center gap-1">
              <Route className="h-4 w-4" />
              <span>{Math.round(segment.distance || segment.approximateMiles)} miles</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{segment.driveTimeHours}h driving</span>
            </div>
          </div>
        </div>

        {/* Drive Time Message */}
        {segment.driveTimeCategory && (
          <div className={`mt-3 p-3 rounded-lg border ${colors.bg} ${colors.border}`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={`h-4 w-4 mt-0.5 ${colors.text}`} />
              <div>
                <div className={`font-semibold text-sm ${colors.text}`}>
                  {segment.driveTimeCategory.category.charAt(0).toUpperCase() + segment.driveTimeCategory.category.slice(1)} Drive Day
                </div>
                <div className={`text-xs mt-1 ${colors.text}`}>
                  {segment.driveTimeCategory.message}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Enhanced Recommended Stops */}
          <div>
            <h4 className="font-travel font-bold text-route66-vintage-brown mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Recommended Stops ({segment.recommendedStops?.length || 0})
            </h4>
            
            {segment.recommendedStops && segment.recommendedStops.length > 0 ? (
              <div className="space-y-2">
                {segment.recommendedStops.slice(0, 3).map((stop, index) => (
                  <div 
                    key={stop.id || index} 
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-route66-border"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-route66-primary rounded-full flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-route66-text-primary text-sm">
                        {stop.name}
                      </div>
                      {stop.city_name && (
                        <div className="text-xs text-route66-text-secondary">
                          {stop.city_name}, {stop.state}
                        </div>
                      )}
                      {stop.category && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {stop.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                {segment.recommendedStops.length > 3 && (
                  <div className="text-xs text-route66-vintage-brown italic text-center p-2 bg-route66-background-alt rounded">
                    +{segment.recommendedStops.length - 3} more stops available
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-4 bg-route66-background-alt rounded-lg border border-route66-border">
                <MapPin className="h-8 w-8 text-route66-text-secondary mx-auto mb-2" />
                <p className="text-sm text-route66-vintage-brown italic">
                  Direct drive - no specific stops planned for this segment
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons and Expandable Content */}
          <SegmentActionButtons
            segment={segment}
            isMapExpanded={isWeatherExpanded}
            setIsMapExpanded={setIsWeatherExpanded}
            isDetailsExpanded={isDetailsExpanded}
            setIsDetailsExpanded={setIsDetailsExpanded}
            tripStartDate={tripStartDate}
          />

          {/* Route Progression */}
          <SegmentRouteProgression segment={segment} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DaySegmentCard;
