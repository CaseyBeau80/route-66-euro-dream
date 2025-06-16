
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { format } from 'date-fns';
import SimpleWeatherDisplay from '../weather/SimpleWeatherDisplay';
import { useEdgeFunctionWeather } from '../weather/hooks/useEdgeFunctionWeather';
import { WeatherUtilityService } from '../weather/services/WeatherUtilityService';

interface SharedDailyItineraryProps {
  segments: DailySegment[];
  tripStartDate?: Date;
}

const SharedDailyItinerary: React.FC<SharedDailyItineraryProps> = ({
  segments,
  tripStartDate
}) => {
  console.log('🔥 PREVIEW FORM: SharedDailyItinerary with preview form drive time:', {
    segmentCount: segments.length,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    usingPreviewFormLogic: true
  });

  // Same trip start date logic as before
  const effectiveTripStartDate = React.useMemo(() => {
    if (tripStartDate) {
      console.log('🔥 PREVIEW FORM: Using provided tripStartDate:', tripStartDate.toISOString());
      return tripStartDate;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const possibleParams = ['tripStart', 'startDate', 'start_date', 'trip_start', 'tripStartDate'];
      
      for (const paramName of possibleParams) {
        const tripStartParam = urlParams.get(paramName);
        if (tripStartParam) {
          const parsedDate = new Date(tripStartParam);
          if (!isNaN(parsedDate.getTime())) {
            console.log('🔥 PREVIEW FORM: Extracted tripStartDate from URL:', {
              param: paramName,
              value: tripStartParam,
              parsedDate: parsedDate.toISOString()
            });
            return parsedDate;
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ PREVIEW FORM: Failed to parse trip start date from URL:', error);
    }

    const today = new Date();
    console.log('🔥 PREVIEW FORM: Using today as fallback tripStartDate:', today.toISOString());
    return today;
  }, [tripStartDate]);

  // PREVIEW FORM LOGIC: Use exact same calculation as preview form
  const getPreviewFormDriveTime = (segment: DailySegment): string => {
    const miles = segment.approximateMiles || segment.distance || 0;
    const hours = miles / 60; // Same calculation as preview form
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes > 0) {
      return `${wholeHours}h ${minutes}m`;
    }
    return `${wholeHours}h`;
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-route66-primary rounded">
        <h3 className="text-lg font-bold text-white mb-2 font-route66">
          📅 DAILY ITINERARY WITH WEATHER
        </h3>
        <p className="text-route66-cream text-sm font-travel">
          Your complete day-by-day guide with preview form drive times
        </p>
        {effectiveTripStartDate && (
          <p className="text-route66-cream text-xs mt-1">
            Trip starts: {format(effectiveTripStartDate, 'EEEE, MMMM d, yyyy')}
          </p>
        )}
      </div>
      
      {segments.map((segment, index) => {
        // PREVIEW FORM LOGIC: Use exact same calculation as preview form
        const driveTime = getPreviewFormDriveTime(segment);
        const distance = segment.approximateMiles || segment.distance || 0;
        const segmentDate = WeatherUtilityService.getSegmentDate(effectiveTripStartDate, segment.day);

        console.log(`🔥 PREVIEW FORM: Rendering segment ${segment.day} for ${segment.endCity}`, {
          segmentDay: segment.day,
          endCity: segment.endCity,
          segmentDate: segmentDate.toISOString(),
          previewFormDriveTime: driveTime,
          approximateMiles: segment.approximateMiles,
          distance: segment.distance
        });

        return (
          <div key={`preview-form-shared-day-${segment.day}-${segment.endCity}`} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Day Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Day {segment.day}</h3>
                  <p className="text-blue-100">
                    {format(segmentDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{segment.endCity}</p>
                  <p className="text-blue-100 text-sm">Destination</p>
                </div>
              </div>
            </div>

            {/* Day Content */}
            <div className="p-4 space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded border">
                  <div className="text-lg font-bold text-blue-600">
                    🗺️ {Math.round(distance)}
                  </div>
                  <div className="text-xs text-gray-600">Miles</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded border">
                  <div className="text-lg font-bold text-purple-600">
                    ⏱️ {driveTime}
                  </div>
                  <div className="text-xs text-gray-600">Drive Time</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded border">
                  <div className="text-sm font-medium text-gray-700">
                    🚗 From
                  </div>
                  <div className="text-xs text-gray-600">{segment.startCity}</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded border">
                  <div className="text-sm font-medium text-gray-700">
                    🏁 To
                  </div>
                  <div className="text-xs text-gray-600">{segment.endCity}</div>
                </div>
              </div>

              {/* Weather section with consistent display */}
              <WeatherWidget
                segment={segment}
                segmentDate={segmentDate}
                isSharedView={true}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Weather Widget Component for Shared View
const WeatherWidget: React.FC<{
  segment: DailySegment;
  segmentDate: Date;
  isSharedView: boolean;
}> = ({ segment, segmentDate, isSharedView }) => {
  const { weather, loading, error } = useEdgeFunctionWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day
  });

  console.log('🌤️ CONSISTENT: WeatherWidget for shared view:', {
    cityName: segment.endCity,
    hasWeather: !!weather,
    loading,
    error,
    weatherDetails: weather ? {
      temperature: weather.temperature,
      windSpeed: weather.windSpeed,
      precipitationChance: weather.precipitationChance,
      humidity: weather.humidity
    } : null
  });

  if (loading) {
    return (
      <div className="weather-section bg-gray-50 rounded-lg p-4 border">
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            🌤️ Weather Forecast for {segment.endCity}
          </h4>
        </div>
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (weather) {
    return (
      <div className="weather-section bg-gray-50 rounded-lg p-4 border">
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            🌤️ Weather Forecast for {segment.endCity}
          </h4>
        </div>
        
        <SimpleWeatherDisplay
          weather={weather}
          segmentDate={segmentDate}
          cityName={segment.endCity}
          isSharedView={isSharedView}
          isPDFExport={false}
        />
      </div>
    );
  }

  return (
    <div className="weather-section bg-gray-50 rounded-lg p-4 border">
      <div className="mb-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">
          🌤️ Weather Forecast for {segment.endCity}
        </h4>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
        <div className="text-amber-600 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-amber-700 font-medium">Weather forecast temporarily unavailable</p>
        {error && <p className="text-xs text-amber-600 mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default SharedDailyItinerary;
