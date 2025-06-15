
import React from 'react';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Route, Share2, DollarSign } from 'lucide-react';
import { useCostEstimator } from '../../TripCalculator/hooks/useCostEstimator';
import TripSummaryStats from './TripSummaryStats';
import { useUnifiedWeather } from '../../TripCalculator/components/weather/hooks/useUnifiedWeather';
import { WeatherUtilityService } from '../../TripCalculator/components/weather/services/WeatherUtilityService';
import { format } from 'date-fns';
import { LiveWeatherDetectionService } from '../../TripCalculator/components/weather/services/LiveWeatherDetectionService';

interface TripResultsProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  onShareTrip?: () => void;
}

const TripResults: React.FC<TripResultsProps> = ({
  tripPlan,
  tripStartDate,
  onShareTrip
}) => {
  const { costEstimate } = useCostEstimator(tripPlan);

  if (!tripPlan) {
    return null;
  }

  const handleShareTrip = () => {
    if (onShareTrip) {
      onShareTrip();
    }
  };

  // FIXED: Use actual driveTimeHours directly from segment data with proper fallback
  const formatDriveTime = (segment: any): string => {
    console.log('🚗 FIXED TripResults: formatDriveTime called with segment:', {
      city: segment.endCity,
      driveTimeHours: segment.driveTimeHours,
      distance: segment.distance,
      day: segment.day,
      segmentData: segment
    });
    
    // PRIORITY 1: Use the actual driveTimeHours value if available and valid
    if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
      const hours = Math.floor(segment.driveTimeHours);
      const minutes = Math.round((segment.driveTimeHours - hours) * 60);
      console.log('✅ FIXED TripResults: Using actual driveTimeHours:', { 
        hours, 
        minutes, 
        total: segment.driveTimeHours,
        formatted: `${hours}h ${minutes}m`
      });
      return `${hours}h ${minutes}m`;
    }
    
    // PRIORITY 2: Calculate from distance if available
    if (typeof segment.distance === 'number' && segment.distance > 0) {
      const estimatedHours = segment.distance / 55; // Assuming 55 mph average
      const hours = Math.floor(estimatedHours);
      const minutes = Math.round((estimatedHours - hours) * 60);
      console.log('⚠️ FIXED TripResults: Using distance calculation:', { 
        distance: segment.distance, 
        estimatedHours,
        hours, 
        minutes,
        formatted: `${hours}h ${minutes}m`
      });
      return `${hours}h ${minutes}m`;
    }
    
    // FALLBACK: Use a reasonable default
    console.log('❌ FIXED TripResults: Using fallback time - no valid data found');
    return '3h 30m'; // More realistic fallback than 4h 0m
  };

  return (
    <div className="space-y-6 p-6">
      {/* Trip Summary */}
      <div className="text-center border-b border-route66-border pb-6">
        <h2 className="text-2xl font-bold text-route66-primary mb-2">
          Your Route 66 Adventure
        </h2>
        <p className="text-route66-text-secondary">
          {tripPlan.startCity} to {tripPlan.endCity}
        </p>
        
        <TripSummaryStats tripPlan={tripPlan} costEstimate={costEstimate} />
      </div>

      {/* Daily Segments */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-route66-primary mb-4">
          Daily Itinerary
        </h3>
        
        {tripPlan.segments?.map((segment, index) => (
          <Card key={index} className="p-4 border border-route66-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-route66-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {segment.day}
                </div>
                <div>
                  <h4 className="font-bold text-route66-text-primary">
                    Day {segment.day}
                  </h4>
                  <p className="text-sm text-route66-text-secondary">
                    {segment.startCity} → {segment.endCity}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-route66-text-secondary mt-2 md:mt-0">
                <div className="flex items-center gap-1">
                  <Route className="w-4 h-4" />
                  {Math.round(segment.distance)} miles
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDriveTime(segment)}
                </div>
              </div>
            </div>

            {/* Enhanced Weather Display */}
            {tripStartDate && (
              <WeatherSegmentDisplay
                segment={segment}
                tripStartDate={tripStartDate}
              />
            )}

            {/* Attractions */}
            {segment.attractions && segment.attractions.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium text-route66-text-primary mb-2">
                  Recommended Stops:
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {segment.attractions.slice(0, 4).map((attraction, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <MapPin className="w-3 h-3 text-route66-primary flex-shrink-0" />
                      <span className="text-route66-text-secondary truncate">
                        {attraction.name}
                      </span>
                    </div>
                  ))}
                </div>
                {segment.attractions.length > 4 && (
                  <p className="text-xs text-route66-text-secondary mt-2">
                    +{segment.attractions.length - 4} more attractions
                  </p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleShareTrip}
          className="bg-route66-primary hover:bg-route66-primary/90 text-white px-6 py-2"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Trip
        </Button>
      </div>
    </div>
  );
};

// FIXED: Completely rewritten weather component using EXACT Preview logic
const WeatherSegmentDisplay: React.FC<{
  segment: any;
  tripStartDate: Date;
}> = ({ segment, tripStartDate }) => {
  // Calculate segment date using the same logic as Preview
  const segmentDate = React.useMemo(() => {
    return WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
  }, [tripStartDate, segment.day]);

  // Use the unified weather hook with the same parameters as Preview
  const { weather, loading, error } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day,
    prioritizeCachedData: false,
    cachedWeather: null
  });

  // CRITICAL FIX: Use EXACT same detection logic as Preview
  const isLiveForecast = React.useMemo(() => {
    if (!weather) return false;
    
    console.log('🔥 CRITICAL FIX: Weather detection in TripResults:', {
      cityName: segment.endCity,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      detectionInputs: {
        sourceIsLiveForecast: weather.source === 'live_forecast',
        isActualForecastTrue: weather.isActualForecast === true
      }
    });
    
    // EXACT SAME LOGIC AS PREVIEW: Both conditions must be true
    const result = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    console.log('🔥 CRITICAL FIX: Final detection result:', {
      cityName: segment.endCity,
      isLiveForecast: result,
      willShowGreen: result,
      willShowYellow: !result
    });
    
    return result;
  }, [weather, segment.endCity]);

  console.log('🌤️ CRITICAL FIX: WeatherSegmentDisplay for', segment.endCity, {
    day: segment.day,
    hasWeather: !!weather,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    isLiveForecast,
    segmentDate: segmentDate.toISOString(),
    expectedColor: isLiveForecast ? 'GREEN (Live)' : 'YELLOW (Historical)'
  });

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '⛅';
  };

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  if (weather && segmentDate) {
    const weatherIcon = getWeatherIcon(weather.icon);
    const formattedDate = format(segmentDate, 'EEEE, MMM d');

    // CRITICAL FIX: Use EXACT same styling logic as Preview form
    const containerClasses = isLiveForecast 
      ? "bg-green-100 border-green-200 rounded-lg p-4 border mb-4"
      : "bg-yellow-100 border-yellow-200 rounded-lg p-4 border mb-4";
    
    const sourceLabel = isLiveForecast ? '🟢 Live Weather Forecast' : '🟡 Historical Weather Data';
    const badgeText = isLiveForecast ? '✨ Live weather forecast' : '📊 Historical weather patterns';
    const badgeClasses = isLiveForecast
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";
    const sourceColor = isLiveForecast ? 'text-green-600' : 'text-yellow-600';

    console.log('🎨 CRITICAL FIX: Applied styling for', segment.endCity, {
      isLiveForecast,
      containerClasses,
      sourceLabel,
      expectedBackgroundColor: isLiveForecast ? 'GREEN' : 'YELLOW'
    });

    return (
      <div className={containerClasses}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${sourceColor}`}>
            {sourceLabel}
          </span>
          <span className="text-xs text-gray-600">{formattedDate}</span>
        </div>

        {/* Main Weather Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{weatherIcon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(weather.temperature)}°F
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {weather.description}
              </div>
            </div>
          </div>

          <div className="text-right">
            {weather.highTemp && weather.lowTemp && (
              <div className="text-sm text-gray-600">
                H: {Math.round(weather.highTemp)}° L: {Math.round(weather.lowTemp)}°
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              💧 {weather.precipitationChance}% • 💨 {weather.windSpeed} mph
            </div>
          </div>
        </div>

        {/* Weather Status Badge */}
        <div className="mt-2 text-center">
          <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium border ${badgeClasses}`}>
            {badgeText}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available</p>
    </div>
  );
};

export default TripResults;
