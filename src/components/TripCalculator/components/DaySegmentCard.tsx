
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentHeader from './SegmentHeader';
import SegmentStats from './SegmentStats';
import SegmentRecommendedStops from './SegmentRecommendedStops';
import SegmentRouteProgression from './SegmentRouteProgression';

interface DaySegmentCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
}

const DaySegmentCard: React.FC<DaySegmentCardProps> = ({ 
  segment, 
  tripStartDate 
}) => {
  console.log('🗓️ DaySegmentCard render:', segment.title);

  return (
    <Card className="border border-route66-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Segment Header */}
          <SegmentHeader segment={segment} />
          
          {/* Segment Statistics */}
          <SegmentStats segment={segment} />
          
          {/* Route Progression */}
          <SegmentRouteProgression segment={segment} />
          
          {/* Recommended Stops */}
          <SegmentRecommendedStops segment={segment} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DaySegmentCard;
