
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { format } from 'date-fns';
import SharedOnlyWeatherWidget from '../weather/SharedOnlyWeatherWidget';

interface SharedDailyItineraryProps {
  segments: DailySegment[];
  tripStartDate?: Date;
}

const SharedDailyItinerary: React.FC<SharedDailyItineraryProps> = ({
  segments,
  tripStartDate
}) => {
  console.log('🔥 SHARED ONLY: SharedDailyItinerary using COMPLETELY NEW weather system:', {
    segmentCount: segments.length,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    newWeatherSystem: true
  });

  // Same trip start date logic as before
  const effectiveTripStartDate = React.useMemo(() => {
    if (tripStartDate) {
      console.log('🔥 SHARED ONLY: Using provided tripStartDate:', tripStartDate.toISOString());
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
            console.log('🔥 SHARED ONLY: Extracted tripStartDate from URL:', {
              param: paramName,
              value: tripStartParam,
              parsedDate: parsedDate.toISOString(),
              newWeatherSystem: true
            });
            return parsedDate;
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ SHARED ONLY: Failed to parse trip start date from URL:', error);
    }

    const today = new Date();
    console.log('🔥 SHARED ONLY: Using today as fallback tripStartDate:', today.toISOString());
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

        console.log(`🔥 SHARED ONLY: Rendering segment ${segment.day} for ${segment.endCity} with NEW weather system`, {
          segmentDay: segment.day,
          endCity: segment.endCity,
          hasEffectiveTripStartDate: !!effectiveTripStartDate,
          newWeatherSystem: true,
          uniqueKey: `shared-only-day-${segment.day}-${segment.endCity}-${Date.now()}`
        });

        return (
          <div key={`shared-only-day-${segment.day}-${Date.now()}`} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
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

              {/* Weather section - using COMPLETELY NEW system */}
              <div className="weather-section bg-gray-50 rounded-lg p-4 border">
                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    🌤️ Weather Forecast for {segment.endCity}
                  </h4>
                  <p className="text-xs text-gray-500">Using completely new isolated weather system</p>
                </div>
                
                <SharedOnlyWeatherWidget
                  segment={segment}
                  tripStartDate={effectiveTripStartDate}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SharedDailyItinerary;
