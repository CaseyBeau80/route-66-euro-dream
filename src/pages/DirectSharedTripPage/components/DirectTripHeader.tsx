
import React from 'react';
import { format } from 'date-fns';

interface DirectTripHeaderProps {
  title: string;
  totalDays: number;
  totalDistance: number;
  tripStartDate?: Date;
}

const DirectTripHeader: React.FC<DirectTripHeaderProps> = ({
  title,
  totalDays,
  totalDistance,
  tripStartDate
}) => {
  return (
    <div className="text-center mb-8 p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600 mb-4">
        {totalDays}-day Route 66 adventure • {Math.round(totalDistance)} miles
      </p>
      {tripStartDate && (
        <p className="text-sm text-gray-500">
          Starting {format(tripStartDate, 'EEEE, MMMM d, yyyy')}
        </p>
      )}
    </div>
  );
};

export default DirectTripHeader;
