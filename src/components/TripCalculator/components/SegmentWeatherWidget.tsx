
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import UnifiedWeatherWidget from './weather/UnifiedWeatherWidget';

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
  console.log('🎯 SEGMENT WIDGET: Render for', segment.endCity, {
    day: segment.day,
    tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate?.toISOString(),
    componentName: 'SegmentWeatherWidget',
    renderTimestamp: new Date().toISOString()
  });

  // Convert string to Date if needed and validate
  const normalizedTripStartDate = React.useMemo(() => {
    if (!tripStartDate) {
      console.log('🎯 SEGMENT WIDGET: No trip start date provided for', segment.endCity);
      return undefined;
    }
    
    try {
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('🎯 SEGMENT WIDGET: Invalid Date object for', segment.endCity, tripStartDate);
          return undefined;
        }
        console.log('🎯 SEGMENT WIDGET: Valid Date object for', segment.endCity, {
          date: tripStartDate.toISOString()
        });
        return tripStartDate;
      }
      
      if (typeof tripStartDate === 'string') {
        const parsed = new Date(tripStartDate);
        if (isNaN(parsed.getTime())) {
          console.error('🎯 SEGMENT WIDGET: Invalid date string for', segment.endCity, tripStartDate);
          return undefined;
        }
        console.log('🎯 SEGMENT WIDGET: Parsed date string for', segment.endCity, {
          original: tripStartDate,
          parsed: parsed.toISOString()
        });
        return parsed;
      }
      
      console.error('🎯 SEGMENT WIDGET: Unexpected date type for', segment.endCity, {
        type: typeof tripStartDate,
        value: tripStartDate
      });
      return undefined;
    } catch (error) {
      console.error('🎯 SEGMENT WIDGET: Date processing error for', segment.endCity, error);
      return undefined;
    }
  }, [tripStartDate, segment.endCity]);

  console.log('🎯 SEGMENT WIDGET: Passing to unified widget for', segment.endCity, {
    day: segment.day,
    hasNormalizedDate: !!normalizedTripStartDate,
    normalizedDate: normalizedTripStartDate?.toISOString()
  });

  return (
    <div className="space-y-3" data-segment-day={segment.day}>
      <UnifiedWeatherWidget
        segment={segment}
        tripStartDate={normalizedTripStartDate}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    </div>
  );
};

export default SegmentWeatherWidget;
