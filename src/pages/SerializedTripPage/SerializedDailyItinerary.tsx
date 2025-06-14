
import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '@/components/TripCalculator/services/planning/TripPlanBuilder';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { TripDataSerializer } from '@/components/TripCalculator/services/TripDataSerializer';
import SerializedWeatherDisplay from './SerializedWeatherDisplay';
import { MapPin, Clock, Route } from 'lucide-react';

interface SerializedDailyItineraryProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  weatherData: Record<string, ForecastWeatherData>;
}

const SerializedDailyItinerary: React.FC<SerializedDailyItineraryProps> = ({
  segments,
  tripStartDate,
  weatherData
}) => {
  if (!segments || segments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No itinerary data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Itinerary</h2>
      
      {segments.map((segment) => {
        const segmentDate = tripStartDate 
          ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000)
          : undefined;

        const weatherKey = TripDataSerializer.createWeatherDataKey(segment.endCity, segment.day);
        const segmentWeather = weatherData[weatherKey];

        return (
          <div key={segment.day} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Day Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Day {segment.day}</h3>
                  <p className="text-blue-100">
                    {segmentDate && format(segmentDate, 'EEEE, MMMM d')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{segment.endCity}</p>
                  <p className="text-blue-100 text-sm">Destination</p>
                </div>
              </div>
            </div>

            {/* Day Content */}
            <div className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Route className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {Math.round(segment.distance)}
                  </div>
                  <div className="text-xs text-gray-600">Miles</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {segment.drivingTime || Math.round(segment.distance / 55)}h
                  </div>
                  <div className="text-xs text-gray-600">Drive Time</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {segment.startCity} → {segment.endCity}
                  </div>
                  <div className="text-xs text-gray-600">Route</div>
                </div>
              </div>

              {/* Weather Display */}
              {segmentWeather && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    🌤️ Weather Forecast for {segment.endCity}
                  </h4>
                  <SerializedWeatherDisplay
                    weather={segmentWeather}
                    segmentDate={segmentDate}
                    cityName={segment.endCity}
                  />
                </div>
              )}

              {/* Attractions */}
              {segment.attractions && segment.attractions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    📍 Recommended Stops
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {segment.attractions.slice(0, 4).map((attraction, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <MapPin className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 truncate">
                          {attraction.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  {segment.attractions.length > 4 && (
                    <p className="text-xs text-gray-500 mt-2">
                      +{segment.attractions.length - 4} more attractions
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SerializedDailyItinerary;
