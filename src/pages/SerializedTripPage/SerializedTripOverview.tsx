
import React from 'react';
import { format } from 'date-fns';
import { TripPlan } from '@/components/TripCalculator/services/planning/TripPlanBuilder';
import { MapPin, Calendar, Route, CloudSun } from 'lucide-react';

interface SerializedTripOverviewProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  weatherDataCount: number;
}

const SerializedTripOverview: React.FC<SerializedTripOverviewProps> = ({
  tripPlan,
  tripStartDate,
  weatherDataCount
}) => {
  const segments = tripPlan.segments || [];
  const startCity = segments[0]?.startCity || tripPlan.startCity || 'Route 66';
  const endCity = segments[segments.length - 1]?.endCity || tripPlan.endCity || 'Destination';

  return (
    <div className="text-center mb-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {tripPlan.title || `${startCity} to ${endCity} Route 66 Trip`}
      </h1>
      
      <p className="text-gray-600 mb-4">
        {tripPlan.totalDays || segments.length}-day Route 66 adventure • {Math.round(tripPlan.totalDistance || 0)} miles
      </p>

      {tripStartDate && (
        <p className="text-sm text-gray-500 mb-4">
          Starting {format(tripStartDate, 'EEEE, MMMM d, yyyy')}
        </p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{tripPlan.totalDays || segments.length}</div>
          <div className="text-sm text-gray-600">Days</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            <Route className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{Math.round(tripPlan.totalDistance || 0)}</div>
          <div className="text-sm text-gray-600">Miles</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{segments.length}</div>
          <div className="text-sm text-gray-600">Stops</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            <CloudSun className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{weatherDataCount}</div>
          <div className="text-sm text-gray-600">Weather Forecasts</div>
        </div>
      </div>

      {/* Weather Data Notice */}
      {weatherDataCount > 0 && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-300">
          <p className="text-sm text-blue-800 flex items-center justify-center gap-2">
            <CloudSun className="w-4 h-4" />
            This trip includes {weatherDataCount} live weather forecasts for accurate planning
          </p>
        </div>
      )}
    </div>
  );
};

export default SerializedTripOverview;
