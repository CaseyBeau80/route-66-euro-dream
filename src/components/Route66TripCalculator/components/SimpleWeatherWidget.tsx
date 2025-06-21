
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
      calculatedLocal: targetDate.toLocaleDateString(),
      dayVerification: segment.day === 1 ? {
        tripStartString: tripStartDate.toDateString(),
        day1String: targetDate.toDateString(),
        matches: tripStartDate.toDateString() === targetDate.toDateString()
      } : null
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
        isLive: result.source === 'live_api',
        fetchTime: result.fetchTime
      });

      setWeatherResult(result);
    } catch (error) {
      console.error('❌ SIMPLE WEATHER: Weather fetch failed for', segment.endCity, error);
      // Create error result
      setWeatherResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
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
      });
    } finally {
      setLoading(false);
    }
  }, [segment.endCity, segmentDate]);

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
  if (weatherResult) {
    return (
      <EnhancedWeatherDisplay
        weatherResult={weatherResult}
        segmentDate={segmentDate}
        cityName={segment.endCity}
        onRetry={fetchWeather}
      />
    );
  }

  // Fallback state
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available</p>
      <button
        onClick={fetchWeather}
        className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
      >
        Retry
      </button>
    </div>
  );
};

export default SimpleWeatherWidget;
