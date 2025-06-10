
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';

interface TripOverviewSectionProps {
  tripPlan: TripPlan;
}

const TripOverviewSection: React.FC<TripOverviewSectionProps> = ({ tripPlan }) => {
  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
      <h2 className="text-xl font-bold text-blue-800 mb-4 text-center">
        🛣️ YOUR ROUTE 66 JOURNEY OVERVIEW
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
          <div className="font-bold text-blue-600 text-lg">{tripPlan.startCity}</div>
          <div className="text-gray-600 text-xs mt-1">Starting Point</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
          <div className="font-bold text-blue-600 text-lg">{tripPlan.endCity}</div>
          <div className="text-gray-600 text-xs mt-1">Destination</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
          <div className="font-bold text-red-600 text-lg">{tripPlan.totalDays}</div>
          <div className="text-gray-600 text-xs mt-1">Adventure Days</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
          <div className="font-bold text-red-600 text-lg">{Math.round(tripPlan.totalDistance)}</div>
          <div className="text-gray-600 text-xs mt-1">Historic Miles</div>
        </div>
      </div>
      
      {/* Journey Description */}
      <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200 text-center">
        <p className="text-sm text-gray-700">
          <strong>🗺️ Experience America's Main Street:</strong> This carefully planned itinerary takes you through 
          the heart of Route 66, featuring historic landmarks, classic diners, vintage motels, and unforgettable 
          roadside attractions that define the spirit of the open road.
        </p>
      </div>
    </div>
  );
};

export default TripOverviewSection;
