
import React, { useState, useEffect } from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { PriorityWeatherService, PriorityWeatherResult } from './PriorityWeatherService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import WeatherIcon from './WeatherIcon';

interface PriorityWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate: Date;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const PriorityWeatherWidget: React.FC<PriorityWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  const [weatherResult, setWeatherResult] = useState<PriorityWeatherResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate segment date with proper timezone handling
  const segmentDate = React.useMemo(() => {
    const baseDate = new Date(tripStartDate);
    baseDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    const targetDate = new Date(baseDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
    
    console.log('📅 PRIORITY WIDGET: Date calculation for', segment.endCity, {
      tripStartDate: tripStartDate.toISOString(),
      segmentDay: segment.day,
      calculatedDate: targetDate.toISOString(),
      localDate: targetDate.toLocaleDateString()
    });
    
    return targetDate;
  }, [tripStartDate, segment.day]);

  // Fetch weather with priority system
  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      console.log('🚀 PRIORITY WIDGET: Starting fetch for', segment.endCity);
      setIsLoading(true);
      setError(null);

      try {
        const result = await PriorityWeatherService.fetchWeatherWithPriority(
          segment.endCity,
          segmentDate,
          segment.day
        );

        if (isMounted) {
          console.log('✅ PRIORITY WIDGET: Weather result for', segment.endCity, {
            source: result.source,
            delay: result.delay,
            temperature: result.weather.temperature
          });
          setWeatherResult(result);
        }
      } catch (err) {
        if (isMounted) {
          console.error('❌ PRIORITY WIDGET: Error for', segment.endCity, err);
          setError(err instanceof Error ? err.message : 'Weather fetch failed');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, [segment.endCity, segmentDate, segment.day]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 min-h-[120px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !weatherResult) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-3 text-center">
        <div className="text-red-600 text-2xl mb-1">⚠️</div>
        <p className="text-xs text-red-700 font-medium">Weather data unavailable</p>
        <p className="text-xs text-red-600 mt-1">{error || 'Unknown error'}</p>
      </div>
    );
  }

  const { weather, source } = weatherResult;
  const isLive = source === 'live_api';
  
  // Styling based on data source
  const containerClass = isLive
    ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
    : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200";

  const sourceLabel = PriorityWeatherService.getSourceLabel(weather);
  const sourceColor = PriorityWeatherService.getSourceColor(weather);
  const badgeText = isLive ? "✨ Live forecast" : "📊 Seasonal data";

  return (
    <div className={`${containerClass} border rounded-lg p-4 space-y-3`}>
      {/* Header with date and source */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          {format(segmentDate, 'EEEE, MMMM d')}
        </div>
        <div className="flex items-center gap-1">
          <span 
            className="text-xs px-2 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: sourceColor }}
          >
            {badgeText}
          </span>
        </div>
      </div>

      {/* Weather content */}
      <div className="flex items-center gap-3">
        <WeatherIcon iconCode={weather.icon} className="w-12 h-12" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-gray-800">
              {weather.temperature}°F
            </span>
            {weather.highTemp && weather.lowTemp && weather.highTemp !== weather.lowTemp && (
              <span className="text-sm text-gray-600">
                H: {weather.highTemp}° L: {weather.lowTemp}°
              </span>
            )}
          </div>
          <div className="text-sm text-gray-700 capitalize mb-1">
            {weather.description}
          </div>
          <div className="text-xs font-medium" style={{ color: sourceColor }}>
            {sourceLabel}
          </div>
        </div>
      </div>

      {/* Weather details */}
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
        <div className="text-center">
          <div className="font-medium">Humidity</div>
          <div>{weather.humidity}%</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Wind</div>
          <div>{weather.windSpeed} mph</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Rain</div>
          <div>{weather.precipitationChance}%</div>
        </div>
      </div>
    </div>
  );
};

export default PriorityWeatherWidget;
