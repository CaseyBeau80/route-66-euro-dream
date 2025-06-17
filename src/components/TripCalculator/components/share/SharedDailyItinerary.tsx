
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { format } from 'date-fns';
import { DataStandardizationService } from '@/services/DataStandardizationService';
import { useUnits } from '@/contexts/UnitContext';
import UnifiedWeatherWidget from '../weather/UnifiedWeatherWidget';

interface SharedDailyItineraryProps {
  segments: DailySegment[];
  tripStartDate?: Date;
}

const SharedDailyItinerary: React.FC<SharedDailyItineraryProps> = ({
  segments,
  tripStartDate
}) => {
  const { preferences } = useUnits();

  console.log('🔥 STANDARDIZED: SharedDailyItinerary now using standardized formatting:', {
    segmentCount: segments.length,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    preferences: preferences.distance
  });

  // Same trip start date logic as before
  const effectiveTripStartDate = React.useMemo(() => {
    if (tripStartDate) {
      console.log('🔥 STANDARDIZED: Using provided tripStartDate:', tripStartDate.toISOString());
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
            console.log('🔥 STANDARDIZED: Extracted tripStartDate from URL:', {
              param: paramName,
              value: tripStartParam,
              parsedDate: parsedDate.toISOString()
            });
            return parsedDate;
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ STANDARDIZED: Failed to parse trip start date from URL:', error);
    }

    const today = new Date();
    console.log('🔥 STANDARDIZED: Using today as fallback tripStartDate:', today.toISOString());
    return today;
  }, [tripStartDate]);

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
        // Standardize segment data
        const standardizedData = DataStandardizationService.standardizeSegmentData(segment, preferences);

        console.log(`🔥 STANDARDIZED: Rendering segment ${segment.day} for ${segment.endCity}`, {
          segmentDay: segment.day,
          endCity: segment.endCity,
          standardizedData,
          originalDistance: segment.distance,
          originalDriveTime: segment.driveTimeHours
        });

        return (
          <div key={`standardized-shared-day-${segment.day}-${segment.endCity}`} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
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
              {/* Stats Grid - Using Standardized Data */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded border">
                  <div className="text-lg font-bold text-blue-600">
                    🗺️ {standardizedData.distance.formatted}
                  </div>
                  <div className="text-xs text-gray-600">Distance</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded border">
                  <div className="text-lg font-bold text-purple-600">
                    ⏱️ {standardizedData.driveTime.formatted}
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

              {/* Weather section - NOW UNIFIED AND STANDARDIZED */}
              <div className="weather-section bg-gray-50 rounded-lg p-4 border">
                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    🌤️ Weather Forecast for {segment.endCity}
                  </h4>
                  <p className="text-xs text-gray-500">Using standardized temperature formatting</p>
                </div>
                
                <UnifiedWeatherWidget
                  segment={segment}
                  tripStartDate={effectiveTripStartDate}
                  isSharedView={true}
                  isPDFExport={false}
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
