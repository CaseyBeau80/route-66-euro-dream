
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { useWeatherCard } from '../hooks/useWeatherCard';
import { format } from 'date-fns';
import { Cloud, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';

interface UnifiedWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const UnifiedWeatherWidget: React.FC<UnifiedWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return new Date();
    return new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
  }, [tripStartDate, segment.day]);

  const { weatherData, isLoading, error } = useWeatherCard({
    segmentEndCity: segment.endCity,
    segmentDay: segment.day,
    tripStartDate,
    componentName: 'UnifiedWeatherWidget'
  });

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    }
    if (lowerCondition.includes('snow')) {
      return <Snowflake className="h-6 w-6 text-blue-300" />;
    }
    if (lowerCondition.includes('cloud')) {
      return <Cloud className="h-6 w-6 text-gray-500" />;
    }
    if (lowerCondition.includes('wind')) {
      return <Wind className="h-6 w-6 text-gray-600" />;
    }
    return <Sun className="h-6 w-6 text-yellow-500" />;
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            <div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="text-right">
            <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-amber-600" />
          <span className="text-sm text-amber-700">Weather data unavailable</span>
        </div>
      </div>
    );
  }

  const highTemp = weatherData.highTemp || weatherData.temperature;
  const lowTemp = weatherData.lowTemp || weatherData.temperature;

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weatherData.description || '')}
          <div>
            <div className="text-sm font-medium text-gray-800">
              {format(segmentDate, 'MMM d')}
            </div>
            <div className="text-xs text-gray-600">
              {segment.endCity}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          {/* Only show high/low temperatures, no current temperature */}
          {highTemp && lowTemp && highTemp !== lowTemp ? (
            <div className="text-lg font-bold text-gray-800">
              {Math.round(highTemp)}° / {Math.round(lowTemp)}°
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-800">
              {Math.round(highTemp || lowTemp || 0)}°F
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-gray-600 capitalize">
          {weatherData.description || 'Partly Cloudy'}
        </div>
        
        {weatherData.precipitationChance && (
          <div className="text-xs text-gray-600">
            💧 {weatherData.precipitationChance}%
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedWeatherWidget;
