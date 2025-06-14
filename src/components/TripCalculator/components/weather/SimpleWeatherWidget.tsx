
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { useUnifiedWeather } from './hooks/useUnifiedWeather';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';

interface SimpleWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SimpleWeatherWidget: React.FC<SimpleWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log('🎯 SHARED: SimpleWeatherWidget rendering', segment.endCity, {
    day: segment.day,
    isSharedView,
    isPDFExport,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString()
  });

  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) {
      // For shared views, try to get date from URL params
      if (isSharedView) {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const tripStartParam = urlParams.get('tripStart') || urlParams.get('startDate');
          
          if (tripStartParam) {
            const parsedDate = new Date(tripStartParam);
            if (!isNaN(parsedDate.getTime())) {
              const calculatedDate = WeatherUtilityService.getSegmentDate(parsedDate, segment.day);
              console.log('🔧 SHARED: Calculated date from URL params:', {
                urlParam: tripStartParam,
                segmentDay: segment.day,
                calculatedDate: calculatedDate?.toISOString()
              });
              return calculatedDate;
            }
          }
        } catch (error) {
          console.warn('⚠️ Failed to parse trip start date from URL:', error);
        }
      }
      return null;
    }
    
    const calculatedDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    console.log('🔧 SHARED: Calculated date from tripStartDate:', {
      tripStartDate: tripStartDate.toISOString(),
      segmentDay: segment.day,
      calculatedDate: calculatedDate?.toISOString()
    });
    return calculatedDate;
  }, [tripStartDate, segment.day, isSharedView]);

  // Use unified weather hook
  const { weather, loading, error, refetch } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day
  });

  // Check if we have API key for non-shared views
  const hasApiKey = React.useMemo(() => {
    return WeatherApiKeyManager.hasApiKey();
  }, []);

  console.log('🔧 SHARED: Weather state for', segment.endCity, {
    hasWeather: !!weather,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    temperature: weather?.temperature,
    loading,
    error,
    hasApiKey,
    hasSegmentDate: !!segmentDate,
    isSharedView
  });

  // Show loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // Show weather if we have it - THIS IS THE KEY FIX
  if (weather && segmentDate) {
    console.log('✅ SHARED: Displaying weather for', segment.endCity, {
      temperature: weather.temperature,
      source: weather.source,
      isSharedView
    });
    
    return (
      <div className="weather-widget">
        <SimpleWeatherDisplay
          weather={weather}
          segmentDate={segmentDate}
          cityName={segment.endCity}
          isSharedView={isSharedView}
          isPDFExport={isPDFExport}
        />
      </div>
    );
  }

  // For shared/PDF views without weather, show basic message
  if ((isSharedView || isPDFExport) && !segmentDate) {
    console.log('⚠️ SHARED: No segment date for', segment.endCity);
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
        <div className="text-amber-600 text-2xl mb-1">⛅</div>
        <p className="text-xs text-amber-700 font-medium">Check weather before departure</p>
        <p className="text-xs text-amber-600 mt-1">Trip start date needed for weather forecast</p>
      </div>
    );
  }

  // For shared views where weather failed to load
  if (isSharedView || isPDFExport) {
    console.log('⚠️ SHARED: Weather failed for', segment.endCity, { error, hasSegmentDate: !!segmentDate });
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
        <div className="text-amber-600 text-2xl mb-1">⛅</div>
        <p className="text-xs text-amber-700 font-medium">Check weather before departure</p>
        {error && <p className="text-xs text-amber-600 mt-1">{error}</p>}
      </div>
    );
  }

  // Regular view without API key
  if (!hasApiKey && !isSharedView && !isPDFExport) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-600 mb-2">
          Weather forecast requires an API key
        </div>
        <SimpleWeatherApiKeyInput 
          onApiKeySet={() => {
            console.log('🔑 API key set, refetching weather for', segment.endCity);
            refetch();
          }}
          cityName={segment.endCity}
        />
      </div>
    );
  }

  // Error state with retry
  return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded p-3">
        <div className="text-amber-800 text-sm">
          Weather information temporarily unavailable
        </div>
        {error && (
          <div className="text-xs text-amber-600 mt-1">{error}</div>
        )}
      </div>

      {!isSharedView && !isPDFExport && (
        <div className="text-center">
          <button
            onClick={refetch}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Retry weather fetch
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleWeatherWidget;
