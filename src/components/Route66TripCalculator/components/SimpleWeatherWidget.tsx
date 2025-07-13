
import React, { useState, useEffect } from 'react';
import { DailySegment } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { SimpleWeatherFetcher } from '../../TripCalculator/components/weather/SimpleWeatherFetcher';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import EnhancedWeatherDisplay from './EnhancedWeatherDisplay';

interface SimpleWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate: Date;
}

const SimpleWeatherWidget: React.FC<SimpleWeatherWidgetProps> = ({
  segment,
  tripStartDate
}) => {
  const [weather, setWeather] = useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  console.log('🔧 SIMPLE WEATHER WIDGET: Component render with props:', {
    segmentEndCity: segment.endCity,
    segmentDay: segment.day,
    tripStartDate: tripStartDate?.toISOString(),
    tripStartDateIsValid: tripStartDate && !isNaN(tripStartDate.getTime()),
    renderTime: new Date().toISOString()
  });

  // Calculate segment date with proper timezone handling
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate || isNaN(tripStartDate.getTime())) {
      console.error('🚨 SIMPLE WEATHER: Invalid tripStartDate provided:', tripStartDate);
      const fallbackDate = new Date();
      fallbackDate.setHours(12, 0, 0, 0);
      return fallbackDate;
    }

    const baseDate = new Date(tripStartDate);
    // Normalize to prevent timezone drift
    const normalizedBase = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 12, 0, 0, 0);
    const targetDate = new Date(normalizedBase.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
    
    console.log('📅 SIMPLE WEATHER: Date calculation for', segment.endCity, {
      tripStartDate: tripStartDate.toISOString(),
      tripStartLocal: tripStartDate.toLocaleDateString(),
      segmentDay: segment.day,
      calculatedDate: targetDate.toISOString(),
      calculatedLocal: targetDate.toLocaleDateString()
    });
    
    return targetDate;
  }, [tripStartDate, segment.day, segment.endCity]);

  // Fetch weather using unified SimpleWeatherFetcher
  const fetchWeather = React.useCallback(async () => {
    console.log('🌤️ UNIFIED SIMPLE WEATHER: Starting weather fetch for', segment.endCity, {
      segmentDate: segmentDate.toISOString(),
      isValidDate: !isNaN(segmentDate.getTime()),
      unifiedFetcher: true
    });
    
    setLoading(true);

    try {
      const weatherData = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segment.endCity,
        targetDate: segmentDate,
        hasApiKey: true, // Let SimpleWeatherFetcher determine this
        isSharedView: false,
        segmentDay: segment.day
      });

      if (weatherData) {
        console.log('✅ UNIFIED SIMPLE WEATHER: Weather fetch successful for', segment.endCity, {
          temperature: weatherData.temperature,
          source: weatherData.source,
          isActualForecast: weatherData.isActualForecast,
          unifiedFetcher: true
        });
        setWeather(weatherData);
      } else {
        console.log('⚠️ UNIFIED SIMPLE WEATHER: No weather data returned');
        setWeather(createBasicFallback(segment.endCity, segmentDate));
      }
    } catch (error) {
      console.error('❌ UNIFIED SIMPLE WEATHER: Weather fetch failed for', segment.endCity, error);
      setWeather(createBasicFallback(segment.endCity, segmentDate));
    } finally {
      setLoading(false);
    }
  }, [segment.endCity, segmentDate]);

  // Create a basic fallback weather object
  const createBasicFallback = (cityName: string, targetDate: Date): ForecastWeatherData => {
    const month = targetDate.getMonth();
    
    // Seasonal temperature data
    const seasonalTemps = {
      0: 45, 1: 52, 2: 61, 3: 70, 4: 78, 5: 87,
      6: 92, 7: 90, 8: 82, 9: 71, 10: 58, 11: 47
    };

    const baseTemp = seasonalTemps[month as keyof typeof seasonalTemps];
    const temperature = Math.round(baseTemp);
    const daysFromToday = Math.floor((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    return {
      temperature,
      highTemp: temperature + 8,
      lowTemp: temperature - 8,
      description: 'Partly Cloudy',
      icon: '02d',
      humidity: 60,
      windSpeed: 8,
      precipitationChance: 20,
      cityName,
      source: 'historical_fallback',
      isActualForecast: false,
      forecastDate: targetDate,
      forecast: []
    };
  };

  // Fetch weather when component mounts or dependencies change
  useEffect(() => {
    console.log('🔧 SIMPLE WEATHER: useEffect triggered for', segment.endCity, {
      hasValidDate: !isNaN(segmentDate.getTime()),
      segmentDate: segmentDate.toISOString()
    });
    fetchWeather();
  }, [fetchWeather]);

  // Loading state
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

  // Show weather result
  if (weather) {
    return (
      <EnhancedWeatherDisplay
        weather={weather}
        segmentDate={segmentDate}
        cityName={segment.endCity}
        onRetry={fetchWeather}
      />
    );
  }

  // Fallback state - this should rarely be reached now
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
      <div className="text-center">
        <div className="text-amber-600 text-2xl mb-2">🌤️</div>
        <h4 className="text-sm font-semibold text-amber-800 mb-1">
          Weather for {segment.endCity}
        </h4>
        <p className="text-xs text-amber-700 mb-2">Using seasonal estimate</p>
        <div className="text-lg font-bold text-amber-800 mb-1">
          {createBasicFallback(segment.endCity, segmentDate).temperature}°F
        </div>
        <p className="text-xs text-amber-600">Partly Cloudy</p>
        <button
          onClick={fetchWeather}
          className="text-xs text-amber-700 hover:text-amber-900 underline mt-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default SimpleWeatherWidget;
