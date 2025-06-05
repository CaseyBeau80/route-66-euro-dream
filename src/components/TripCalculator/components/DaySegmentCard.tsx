
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import DrivingTimeMessage from './DrivingTimeMessage';
import SegmentHeader from './SegmentHeader';
import SegmentStats from './SegmentStats';
import SegmentActionButtons from './SegmentActionButtons';
import SegmentRouteProgression from './SegmentRouteProgression';
import SegmentRecommendedStops from './SegmentRecommendedStops';

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

  console.log('📅 Rendering Enhanced DaySegmentCard with Weather Widget:', segment);
  console.log('📅 Trip start date passed to DaySegmentCard:', tripStartDate);

  return (
    <Card className="border-2 border-route66-vintage-brown bg-route66-vintage-beige">
      <CardHeader className="pb-3">
        <SegmentHeader segment={segment} showAdjustmentWarning={showAdjustmentWarning} />
        <SegmentStats segment={segment} />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Dynamic Driving Time Message */}
          <DrivingTimeMessage driveTimeHours={segment.driveTimeHours} />

          {/* Action Buttons and Expandable Content - Weather instead of Map */}
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

          {/* Recommended Stops Summary */}
          <SegmentRecommendedStops segment={segment} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DaySegmentCard;
