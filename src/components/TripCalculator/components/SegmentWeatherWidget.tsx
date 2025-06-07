
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { useSegmentWeatherState } from './weather/hooks/useSegmentWeatherState';
import { useSegmentWeather } from './weather/hooks/useSegmentWeather';
import SegmentWeatherContent from './weather/SegmentWeatherContent';

interface SegmentWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
  forceExpanded?: boolean;
  isCollapsible?: boolean;
}

const SegmentWeatherWidget: React.FC<SegmentWeatherWidgetProps> = ({ 
  segment, 
  tripStartDate,
  cardIndex = 0,
  tripId,
  sectionKey = 'weather',
  forceExpanded = false,
  isCollapsible = false
}) => {
  const weatherService = EnhancedWeatherService.getInstance();
  const hasApiKey = weatherService.hasApiKey();

  // Safely calculate the actual date for this segment
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) {
      console.log('🌤️ SegmentWeatherWidget: No tripStartDate provided');
      return null;
    }
    
    try {
      // Validate that tripStartDate is actually a Date object
      let validStartDate: Date;
      
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('❌ SegmentWeatherWidget: Invalid Date object provided', tripStartDate);
          return null;
        }
        validStartDate = tripStartDate;
      } else if (typeof tripStartDate === 'string') {
        validStartDate = new Date(tripStartDate);
        if (isNaN(validStartDate.getTime())) {
          console.error('❌ SegmentWeatherWidget: Invalid date string provided', tripStartDate);
          return null;
        }
      } else {
        console.error('❌ SegmentWeatherWidget: tripStartDate is not a Date or string', { tripStartDate, type: typeof tripStartDate });
        return null;
      }
      
      const calculatedDate = new Date(validStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
      
      if (isNaN(calculatedDate.getTime())) {
        console.error('❌ SegmentWeatherWidget: Calculated date is invalid', { 
          validStartDate: validStartDate.toISOString(), 
          segmentDay: segment.day, 
          calculatedDate 
        });
        return null;
      }
      
      console.log('🌤️ SegmentWeatherWidget: Calculated valid segment date', {
        startDate: validStartDate.toISOString(),
        segmentDay: segment.day,
        calculatedDate: calculatedDate.toISOString()
      });
      
      return calculatedDate;
      
    } catch (error) {
      console.error('❌ SegmentWeatherWidget: Error calculating segment date:', error, { tripStartDate, segmentDay: segment.day });
      return null;
    }
  }, [tripStartDate, segment.day]);
  
  const daysFromNow = segmentDate 
    ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) 
    : null;

  console.log(`🌤️ SegmentWeatherWidget: Rendering for ${segment.endCity} (Day ${segment.day})`, {
    hasApiKey,
    segmentDate: segmentDate?.toISOString(),
    daysFromNow,
    forceExpanded,
    isCollapsible,
    sectionKey
  });

  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate,
    ...weatherState
  });

  return (
    <div className={`space-y-3 ${isCollapsible ? 'bg-gray-50 rounded-lg p-3' : ''}`}>
      <SegmentWeatherContent
        hasApiKey={hasApiKey}
        loading={weatherState.loading}
        weather={weatherState.weather}
        error={weatherState.error}
        retryCount={weatherState.retryCount}
        segmentEndCity={segment.endCity}
        segmentDate={segmentDate}
        onApiKeySet={weatherHandlers.handleApiKeySet}
        onTimeout={weatherHandlers.handleTimeout}
        onRetry={weatherHandlers.handleRetry}
      />
    </div>
  );
};

export default SegmentWeatherWidget;
