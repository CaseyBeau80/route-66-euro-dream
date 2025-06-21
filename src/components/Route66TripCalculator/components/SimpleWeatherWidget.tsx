
import React, { useState, useEffect } from 'react';
import { DailySegment } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { CentralizedWeatherService, WeatherFetchResult } from '@/services/CentralizedWeatherService';
import EnhancedWeatherDisplay from './EnhancedWeatherDisplay';

interface SimpleWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate: Date;
}

const SimpleWeatherWidget: React.FC<SimpleWeatherWidgetProps> = ({
  segment,
  tripStartDate
}) => {
  const [weatherResult, setWeatherResult] = useState<WeatherFetchResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculate segment date with proper timezone handling
  const segmentDate = React.useMemo(() => {
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
  }, [tripStartDate, segment.day]);

  // Fetch weather using centralized service
  const fetchWeather = React.useCallback(async () => {
    console.log('🌤️ SIMPLE WEATHER: Starting weather fetch for', segment.endCity);
    setLoading(true);

    try {
      const result = await CentralizedWeatherService.fetchWeatherForCity(
        segment.endCity,
        segmentDate
      );

      console.log('✅ SIMPLE WEATHER: Weather fetch completed for', segment.endCity, {
        success: result.success,
        source: result.source,
        temperature: result.weather?.temperature,
        hasWeatherData: !!result.weather,
        fetchTime: result.fetchTime
      });

      // Always set the result, even if there's an error - the service provides fallback
      setWeatherResult(result);
    } catch (error) {
      console.error('❌ SIMPLE WEATHER: Weather fetch failed for', segment.endCity, error);
      
      // Create a basic fallback result with seasonal data
      const fallbackResult: WeatherFetchResult = {
        success: true,
        weather: createBasicFallback(segment.endCity, segmentDate),
        source: 'seasonal_fallback',
        fetchTime: 0,
        debugInfo: {
          apiKeyAvailable: false,
          cityName: segment.endCity,
          targetDate: segmentDate.toISOString().split('T')[0],
          daysFromToday: 0,
          withinForecastRange: false,
          fallbackReason: 'fetch_error'
        }
      };
      
      setWeatherResult(fallbackResult);
    } finally {
      setLoading(false);
    }
  }, [segment.endCity, segmentDate]);

  // Create a basic fallback weather object
  const createBasicFallback = (cityName: string, targetDate: Date) => {
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
      icon: '🌤️',
      humidity: 60,
      windSpeed: 8,
      precipitationChance: 20,
      cityName,
      source: 'seasonal_fallback' as const,
      isActualForecast: false,
      confidence: 'low' as const,
      forecastDate: targetDate,
      daysFromToday
    };
  };

  // Fetch weather when component mounts or dependencies change
  useEffect(() => {
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
  if (weatherResult && weatherResult.weather) {
    return (
      <EnhancedWeatherDisplay
        weatherResult={weatherResult}
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
