
import React from 'react';
import { format } from 'date-fns';
import EnhancedWeatherWidget from '@/components/TripCalculator/components/weather/EnhancedWeatherWidget';

interface DirectTripSegment {
  day: number;
  startCity: string;
  endCity: string;
  distance: number;
  drivingTime: number;
}

interface DirectTripSegmentCardProps {
  segment: DirectTripSegment;
  tripStartDate?: Date;
}

const DirectTripSegmentCard: React.FC<DirectTripSegmentCardProps> = ({
  segment,
  tripStartDate
}) => {
  const segmentDate = tripStartDate 
    ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000)
    : undefined;

  // Convert to DailySegment format for EnhancedWeatherWidget
  const dailySegment = {
    day: segment.day,
    startCity: segment.startCity,
    endCity: segment.endCity,
    distance: segment.distance,
    drivingTime: segment.drivingTime,
    driveTimeHours: segment.drivingTime
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Day Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Day {segment.day}</h3>
            <p className="text-green-100">
              {segmentDate && format(segmentDate, 'EEEE, MMMM d')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{segment.endCity}</p>
            <p className="text-green-100 text-sm">Destination</p>
          </div>
        </div>
      </div>

      {/* Day Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-lg font-bold text-green-600">
              🗺️ {Math.round(segment.distance)}
            </div>
            <div className="text-xs text-gray-600">Miles</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-lg font-bold text-purple-600">
              ⏱️ {segment.drivingTime}h
            </div>
            <div className="text-xs text-gray-600">Drive Time</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-sm font-medium text-gray-700">
              🚗 {segment.startCity} → {segment.endCity}
            </div>
            <div className="text-xs text-gray-600">Route</div>
          </div>
        </div>

        {/* Weather */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            🌤️ Live Weather Forecast for {segment.endCity}
          </h4>
          <EnhancedWeatherWidget
            segment={dailySegment}
            tripStartDate={tripStartDate}
            isSharedView={true}
            isPDFExport={false}
          />
        </div>
      </div>
    </div>
  );
};

export default DirectTripSegmentCard;
