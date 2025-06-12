
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { useSegmentWeatherState } from './weather/hooks/useSegmentWeatherState';
import { useSegmentWeather } from './weather/hooks/useSegmentWeather';
import SegmentWeatherContent from './weather/SegmentWeatherContent';
import WeatherErrorBoundary from './weather/WeatherErrorBoundary';
import { DateNormalizationService } from './weather/DateNormalizationService';
import { WeatherDataDebugger } from './weather/WeatherDataDebugger';

interface SegmentWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date | string;
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
  const [hasApiKey, setHasApiKey] = React.useState(false);
  
  // CRITICAL: Enhanced date calculation with comprehensive debugging
  const segmentDate = React.useMemo(() => {
    console.log(`🗓️ CRITICAL SegmentWeatherWidget date calculation for ${segment.endCity} Day ${segment.day}:`, {
      tripStartDate,
      tripStartDateType: typeof tripStartDate,
      isDateObject: tripStartDate instanceof Date,
      segmentDay: segment.day
    });

    if (!tripStartDate) {
      console.error(`❌ No trip start date provided for ${segment.endCity} Day ${segment.day}`);
      return null;
    }

    // Convert string to Date if needed
    let startDate: Date;
    try {
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('❌ Invalid Date object provided:', tripStartDate);
          return null;
        }
        startDate = tripStartDate;
      } else if (typeof tripStartDate === 'string') {
        startDate = new Date(tripStartDate);
        if (isNaN(startDate.getTime())) {
          console.error('❌ Invalid date string provided:', tripStartDate);
          return null;
        }
      } else {
        console.error('❌ Invalid tripStartDate type:', { tripStartDate, type: typeof tripStartDate });
        return null;
      }
    } catch (error) {
      console.error('❌ Error processing tripStartDate:', error, tripStartDate);
      return null;
    }
    
    const calculatedDate = DateNormalizationService.calculateSegmentDate(startDate, segment.day);
    
    if (!calculatedDate) {
      console.error(`❌ Failed to calculate segment date for ${segment.endCity} Day ${segment.day}`);
      return null;
    }
    
    const dateString = DateNormalizationService.toDateString(calculatedDate);
    const daysFromNow = Math.ceil((calculatedDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    console.log(`✅ CRITICAL SegmentWeatherWidget calculated date for ${segment.endCity} Day ${segment.day}:`, {
      startDate: startDate.toISOString(),
      calculatedDate: calculatedDate.toISOString(),
      dateString,
      daysFromNow,
      isWithinForecastRange: daysFromNow >= 0 && daysFromNow <= 5
    });
    
    WeatherDataDebugger.debugDateCalculation(
      `SegmentWeatherWidget.calculateDate [${segment.endCity}] [Day ${segment.day}]`,
      startDate.toISOString(),
      segment.day,
      calculatedDate
    );
    
    return calculatedDate;
  }, [tripStartDate, segment.day, segment.endCity]);

  // Enhanced weather service initialization with debugging
  React.useEffect(() => {
    if (!weatherService) {
      console.error('❌ CRITICAL: EnhancedWeatherService is null/undefined');
      return;
    }

    try {
      weatherService.refreshApiKey();
      const apiKeyStatus = weatherService.hasApiKey();
      
      console.log(`🔑 SegmentWeatherWidget API key check for ${segment.endCity}:`, {
        hasApiKey: apiKeyStatus,
        weatherServiceExists: !!weatherService,
        segmentDay: segment.day
      });
      
      setHasApiKey(apiKeyStatus);
    } catch (error) {
      console.error('❌ Error checking API key for', segment.endCity, ':', error);
      setHasApiKey(false);
    }
  }, [weatherService, segment.endCity, segment.day]);

  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate,
    ...weatherState
  });

  const handleApiKeySet = React.useCallback(() => {
    console.log(`🔄 SegmentWeatherWidget handling API key set for ${segment.endCity} Day ${segment.day}`);
    
    weatherService.refreshApiKey();
    setHasApiKey(weatherService.hasApiKey());
    weatherHandlers.handleApiKeySet();
  }, [weatherService, weatherHandlers, segment.endCity, segment.day]);

  // Final debug log for current state
  console.log(`🔍 SegmentWeatherWidget final state for ${segment.endCity} Day ${segment.day}:`, {
    hasApiKey,
    hasSegmentDate: !!segmentDate,
    segmentDate: segmentDate?.toISOString(),
    loading: weatherState.loading,
    hasWeather: !!weatherState.weather,
    error: weatherState.error,
    retryCount: weatherState.retryCount
  });

  const containerClass = isCollapsible ? 'bg-gray-50 rounded-lg p-3' : '';

  return (
    <WeatherErrorBoundary 
      segmentEndCity={segment.endCity}
      fallbackMessage={`Weather service error for ${segment.endCity} Day ${segment.day}`}
    >
      <div className={`space-y-3 ${containerClass}`} data-segment-day={segment.day}>
        <SegmentWeatherContent
          hasApiKey={hasApiKey}
          loading={weatherState.loading}
          weather={weatherState.weather}
          error={weatherState.error}
          retryCount={weatherState.retryCount}
          segmentEndCity={segment.endCity}
          segmentDate={segmentDate}
          onApiKeySet={handleApiKeySet}
          onTimeout={weatherHandlers.handleTimeout}
          onRetry={weatherHandlers.handleRetry}
          isSharedView={sectionKey === 'shared-view'}
          isPDFExport={sectionKey === 'pdf-export'}
        />
      </div>
    </WeatherErrorBoundary>
  );
};

export default SegmentWeatherWidget;
