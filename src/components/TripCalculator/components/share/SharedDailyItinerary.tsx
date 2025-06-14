
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { format } from 'date-fns';
// CRITICAL FIX: Import EnhancedWeatherDisplay directly instead of using intermediate widgets
import EnhancedWeatherDisplay from '../weather/EnhancedWeatherDisplay';
import { useUnifiedWeather } from '../weather/hooks/useUnifiedWeather';
import { WeatherUtilityService } from '../weather/services/WeatherUtilityService';

interface SharedDailyItineraryProps {
  segments: DailySegment[];
  tripStartDate?: Date;
}

const SharedDailyItinerary: React.FC<SharedDailyItineraryProps> = ({
  segments,
  tripStartDate
}) => {
  console.log('🔧 CRITICAL FIX: SharedDailyItinerary using DIRECT EnhancedWeatherDisplay:', {
    segmentCount: segments.length,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    sharedViewMode: true,
    directWeatherDisplay: true
  });

  // Use the same trip start date logic as the preview
  const effectiveTripStartDate = React.useMemo(() => {
    if (tripStartDate) {
      console.log('🔧 CRITICAL FIX: Using provided tripStartDate:', tripStartDate.toISOString());
      return tripStartDate;
    }

    // Extract from URL parameters (same as preview)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const possibleParams = ['tripStart', 'startDate', 'start_date', 'trip_start', 'tripStartDate'];
      
      for (const paramName of possibleParams) {
        const tripStartParam = urlParams.get(paramName);
        if (tripStartParam) {
          const parsedDate = new Date(tripStartParam);
          if (!isNaN(parsedDate.getTime())) {
            console.log('🔧 CRITICAL FIX: Extracted tripStartDate from URL for consistent behavior:', {
              param: paramName,
              value: tripStartParam,
              parsedDate: parsedDate.toISOString(),
              consistentWithPreview: true
            });
            return parsedDate;
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ CRITICAL FIX: Failed to parse trip start date from URL:', error);
    }

    // Fallback: use today (same as preview)
    const today = new Date();
    console.log('🔧 CRITICAL FIX: Using today as fallback tripStartDate to MATCH preview:', today.toISOString());
    return today;
  }, [tripStartDate]);

  const formatTime = (hours?: number): string => {
    if (!hours) return 'N/A';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-route66-primary rounded">
        <h3 className="text-lg font-bold text-white mb-2 font-route66">
          📅 DAILY ITINERARY WITH LIVE WEATHER
        </h3>
        <p className="text-route66-cream text-sm font-travel">
          Your complete day-by-day guide with live weather forecasts
        </p>
        {effectiveTripStartDate && (
          <p className="text-route66-cream text-xs mt-1">
            Trip starts: {format(effectiveTripStartDate, 'EEEE, MMMM d, yyyy')}
          </p>
        )}
      </div>
      
      {segments.map((segment, index) => {
        const drivingTime = segment.drivingTime || segment.driveTimeHours || 0;
        const distance = segment.distance || segment.approximateMiles || 0;

        // Calculate segment date
        const segmentDate = effectiveTripStartDate ? 
          WeatherUtilityService.getSegmentDate(effectiveTripStartDate, segment.day) : 
          new Date();

        console.log(`🔧 CRITICAL FIX: Rendering segment ${segment.day} for ${segment.endCity} with DIRECT weather`, {
          segmentDay: segment.day,
          endCity: segment.endCity,
          segmentDate: segmentDate.toISOString(),
          hasEffectiveTripStartDate: !!effectiveTripStartDate,
          isSharedView: true,
          directWeatherDisplay: true,
          uniqueKey: `critical-fix-${segment.day}-${segment.endCity}-${Date.now()}`
        });

        return (
          <div key={`critical-fix-day-${segment.day}-${Date.now()}`} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Day Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Day {segment.day}</h3>
                  <p className="text-blue-100">
                    {effectiveTripStartDate && (
                      format(new Date(effectiveTripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000), 'EEEE, MMMM d, yyyy')
                    )}
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
                    ⏱️ {formatTime(drivingTime)}
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

              {/* CRITICAL FIX: Use DIRECT weather fetching and display */}
              <DirectWeatherSection 
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

// CRITICAL FIX: Direct weather component that bypasses all intermediate layers
const DirectWeatherSection: React.FC<{
  segment: DailySegment;
  segmentDate: Date;
  isSharedView: boolean;
}> = ({ segment, segmentDate, isSharedView }) => {
  // Use unified weather hook directly
  const { weather, loading, error } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day,
    prioritizeCachedData: false,
    cachedWeather: null
  });

  console.log('🔧 CRITICAL FIX: DirectWeatherSection for', segment.endCity, {
    hasWeather: !!weather,
    loading,
    error,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    directFetch: true
  });

  if (loading) {
    return (
      <div className="weather-section bg-gray-50 rounded-lg p-4 border">
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            🌤️ Loading Weather for {segment.endCity}
          </h4>
        </div>
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading live forecast...</span>
        </div>
      </div>
    );
  }

  if (weather) {
    return (
      <div className="weather-section bg-gray-50 rounded-lg p-4 border">
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            🌤️ Live Weather for {segment.endCity}
          </h4>
          <p className="text-xs text-gray-500">Current forecast when available</p>
        </div>
        
        {/* CRITICAL FIX: Use EnhancedWeatherDisplay DIRECTLY */}
        <EnhancedWeatherDisplay
          weather={weather}
          segmentDate={segmentDate}
          cityName={segment.endCity}
          isSharedView={isSharedView}
          isPDFExport={false}
          forceKey={`critical-fix-${segment.endCity}-${Date.now()}`}
          showDebug={true}
        />
      </div>
    );
  }

  return (
    <div className="weather-section bg-gray-50 rounded-lg p-4 border">
      <div className="mb-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">
          🌤️ Weather for {segment.endCity}
        </h4>
      </div>
      <div className="text-center text-gray-500">
        <div className="text-2xl mb-1">🌤️</div>
        <p className="text-xs">Weather forecast temporarily unavailable</p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default SharedDailyItinerary;
