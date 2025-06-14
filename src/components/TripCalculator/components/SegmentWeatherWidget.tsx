
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SimpleWeatherWidget from './weather/SimpleWeatherWidget';

interface SegmentWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date | string;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
  forceExpanded?: boolean;
  isCollapsible?: boolean;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SegmentWeatherWidget: React.FC<SegmentWeatherWidgetProps> = ({ 
  segment, 
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  // Convert string to Date if needed
  const normalizedTripStartDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    if (tripStartDate instanceof Date) return tripStartDate;
    return new Date(tripStartDate);
  }, [tripStartDate]);

  console.log('🔧 SegmentWeatherWidget: Rendering for', segment.endCity, {
    day: segment.day,
    isSharedView,
    isPDFExport,
    hasStartDate: !!normalizedTripStartDate
  });

  return (
    <div className="space-y-3" data-segment-day={segment.day}>
      <SimpleWeatherWidget
        segment={segment}
        tripStartDate={normalizedTripStartDate}
        isSharedView={isSharedView || isPDFExport}
      />
    </div>
  );
};

export default SegmentWeatherWidget;
