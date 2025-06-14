
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { useUnifiedWeather } from './hooks/useUnifiedWeather';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
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
  console.log('🎯 WEATHER-WIDGET: Rendering with enhanced shared view support:', segment.endCity, {
    day: segment.day,
    isSharedView,
    isPDFExport,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString()
  });

  // Calculate segment date with enhanced URL parameter handling
  const segmentDate = React.useMemo(() => {
    // First priority: use passed tripStartDate
    if (tripStartDate) {
      const calculatedDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
      console.log('🔧 WEATHER-WIDGET: Calculated date from tripStartDate:', {
        tripStartDate: tripStartDate.toISOString(),
        segmentDay: segment.day,
        calculatedDate: calculatedDate?.toISOString(),
        source: 'passed_trip_start_date'
      });
      return calculatedDate;
    }

    // Second priority: for shared views, try to get date from URL params
    if (isSharedView) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const possibleParams = ['tripStart', 'startDate', 'start_date', 'trip_start'];
        
        for (const paramName of possibleParams) {
          const tripStartParam = urlParams.get(paramName);
          if (tripStartParam) {
            const parsedDate = new Date(tripStartParam);
            if (!isNaN(parsedDate.getTime())) {
              const calculatedDate = WeatherUtilityService.getSegmentDate(parsedDate, segment.day);
              console.log('🔧 WEATHER-WIDGET: Successfully calculated date from URL params:', {
                urlParam: tripStartParam,
                segmentDay: segment.day,
                calculatedDate: calculatedDate?.toISOString(),
                source: 'url_parameters'
              });
              return calculatedDate;
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Failed to parse trip start date from URL:', error);
      }
    }

    // For shared views without a valid date, use today + segment day offset
    if (isSharedView || isPDFExport) {
      const today = new Date();
      const estimatedDate = new Date(today.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
      console.log('🔧 WEATHER-WIDGET: Using estimated date for shared view:', {
        segmentDay: segment.day,
        estimatedDate: estimatedDate.toISOString(),
        source: 'estimated_from_today'
      });
      return estimatedDate;
    }
    
    return null;
  }, [tripStartDate, segment.day, isSharedView, isPDFExport]);

  // Use unified weather hook with shared view support
  const { weather, loading, error, refetch } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day,
    isSharedView
  });

  console.log('🔧 WEATHER-WIDGET: Weather state for', segment.endCity, {
    hasWeather: !!weather,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    temperature: weather?.temperature,
    highTemp: weather?.highTemp,
    lowTemp: weather?.lowTemp,
    loading,
    error,
    hasSegmentDate: !!segmentDate,
    segmentDate: segmentDate?.toISOString(),
    isSharedView,
    isUsingPublicService: isSharedView
  });

  // Show loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">
            {isSharedView ? 'Loading weather forecast...' : `Loading live weather for ${segment.endCity}...`}
          </span>
        </div>
      </div>
    );
  }

  // Show weather if we have it and a valid date
  if (weather && segmentDate) {
    console.log('✅ WEATHER-WIDGET: Displaying weather for', segment.endCity, {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      description: weather.description,
      isSharedView,
      hasValidDate: true,
      weatherType: weather.source === 'live_forecast' ? 'LIVE_FORECAST' : 'FALLBACK_DATA'
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

  // For shared/PDF views without weather but WITH a date, show enhanced message
  if ((isSharedView || isPDFExport) && segmentDate && !weather && !loading) {
    console.log('⚠️ WEATHER-WIDGET: Have date but no weather for shared view:', segment.endCity);
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
        <div className="text-blue-600 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-blue-700 font-medium">Weather forecast temporarily unavailable</p>
        <p className="text-xs text-blue-600 mt-1">Check current conditions before departure</p>
        {error && <p className="text-xs text-blue-500 mt-1">{error}</p>}
      </div>
    );
  }

  // For shared/PDF views without valid date
  if (isSharedView || isPDFExport) {
    console.log('⚠️ WEATHER-WIDGET: No valid date for weather in shared view:', segment.endCity);
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
        <div className="text-amber-600 text-2xl mb-1">⛅</div>
        <p className="text-xs text-amber-700 font-medium">Weather forecast needs trip date</p>
        <p className="text-xs text-amber-600 mt-1">Add trip start date for accurate forecast</p>
      </div>
    );
  }

  // Regular view without API key - show API key input
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
};

export default SimpleWeatherWidget;
