
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { useSegmentWeatherState } from './weather/hooks/useSegmentWeatherState';
import { useSegmentWeather } from './weather/hooks/useSegmentWeather';
import SegmentWeatherContent from './weather/SegmentWeatherContent';
import WeatherErrorBoundary from './weather/WeatherErrorBoundary';

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
  
  // Always refresh API key status to ensure we have the latest state
  const [hasApiKey, setHasApiKey] = React.useState(false);
  
  React.useEffect(() => {
    // Force refresh of API key status from storage
    weatherService.refreshApiKey();
    const apiKeyStatus = weatherService.hasApiKey();
    setHasApiKey(apiKeyStatus);
    
    console.log(`🔑 SegmentWeatherWidget: API key status for ${segment.endCity}:`, {
      hasApiKey: apiKeyStatus,
      sectionKey,
      debugInfo: weatherService.getDebugInfo()
    });
  }, [weatherService, segment.endCity, sectionKey]);

  console.log(`🌤️ SegmentWeatherWidget: Rendering for ${segment.endCity} (Day ${segment.day})`, {
    tripStartDate: tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate,
    tripStartDateType: typeof tripStartDate,
    hasApiKey,
    sectionKey,
    forceExpanded,
    isSharedView: sectionKey === 'shared-view',
    isPDFExport: sectionKey === 'pdf-export'
  });

  // Calculate the actual date for this segment
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) {
      console.log('🌤️ SegmentWeatherWidget: No tripStartDate provided');
      return null;
    }
    
    try {
      let validStartDate: Date;
      
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('❌ SegmentWeatherWidget: Invalid Date object provided', tripStartDate);
          return null;
        }
        validStartDate = new Date(tripStartDate);
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
      
      // Check if date is within forecast range (5 days from now)
      const daysFromNow = Math.ceil((calculatedDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      const isWithinForecastRange = daysFromNow >= 0 && daysFromNow <= 5;
      
      console.log('✅ SegmentWeatherWidget: Valid segment date calculated', {
        startDate: validStartDate.toISOString(),
        segmentDay: segment.day,
        calculatedDate: calculatedDate.toISOString(),
        daysFromNow,
        isWithinForecastRange,
        canGetForecast: hasApiKey && isWithinForecastRange,
        sectionKey
      });
      
      return calculatedDate;
      
    } catch (error) {
      console.error('❌ SegmentWeatherWidget: Error calculating segment date:', error, { tripStartDate, segmentDay: segment.day });
      return null;
    }
  }, [tripStartDate, segment.day, hasApiKey]);

  const weatherState = useSegmentWeatherState(segment.endCity, segment.day);
  const weatherHandlers = useSegmentWeather({
    segmentEndCity: segment.endCity,
    hasApiKey,
    segmentDate,
    ...weatherState
  });

  // **PDF EXPORT ENHANCEMENT**: Enhanced weather data validation and logging for PDF
  React.useEffect(() => {
    if (weatherState.weather) {
      console.log(`🔍 ${sectionKey === 'pdf-export' ? 'PDF EXPORT' : 'PHASE 3'} - Weather data analysis for ${segment.endCity}:`, {
        hasWeather: true,
        isActualForecast: weatherState.weather.isActualForecast,
        hasDateMatchInfo: !!weatherState.weather.dateMatchInfo,
        dateMatchType: weatherState.weather.dateMatchInfo?.matchType,
        hasHighTemp: weatherState.weather.highTemp !== undefined,
        hasLowTemp: weatherState.weather.lowTemp !== undefined,
        hasTemperature: weatherState.weather.temperature !== undefined,
        hasForecast: !!weatherState.weather.forecast?.length,
        forecastLength: weatherState.weather.forecast?.length || 0,
        segmentDate: segmentDate?.toISOString(),
        daysFromNow: segmentDate ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null,
        sectionKey,
        isSharedView: sectionKey === 'shared-view',
        isPDFExport: sectionKey === 'pdf-export'
      });

      // **PDF EXPORT**: Verify weather object completeness for PDF rendering
      if (weatherState.weather.isActualForecast && !weatherState.weather.dateMatchInfo && sectionKey === 'pdf-export') {
        console.warn(`⚠️ PDF EXPORT WARNING: Live forecast missing dateMatchInfo for ${segment.endCity}`, {
          weather: weatherState.weather,
          segmentDate: segmentDate?.toISOString(),
          willImpactPDFDisplay: true
        });
      }
    }
  }, [weatherState.weather, segment.endCity, segmentDate, sectionKey]);

  // Handle API key updates
  const handleApiKeySet = React.useCallback(() => {
    console.log('🔑 API key set, refreshing weather service state');
    weatherService.refreshApiKey();
    setHasApiKey(weatherService.hasApiKey());
    weatherHandlers.handleApiKeySet();
  }, [weatherService, weatherHandlers]);

  // Mark this element with weather loaded attribute for PDF export
  React.useEffect(() => {
    if (weatherState.weather && !weatherState.loading) {
      // This helps the PDF export system know when weather data is ready
      const element = document.querySelector(`[data-segment-day="${segment.day}"]`);
      if (element) {
        element.setAttribute('data-weather-loaded', 'true');
        
        // **PDF EXPORT**: Additional attribute for PDF-specific weather loading
        if (sectionKey === 'pdf-export') {
          element.setAttribute('data-pdf-weather-ready', 'true');
          console.log(`📄 PDF weather ready for segment ${segment.day}`);
        }
      }
    }
  }, [weatherState.weather, weatherState.loading, segment.day, sectionKey]);

  const containerClass = isCollapsible ? 'bg-gray-50 rounded-lg p-3' : '';

  return (
    <WeatherErrorBoundary 
      segmentEndCity={segment.endCity}
      fallbackMessage={`Weather service error for ${segment.endCity}`}
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
