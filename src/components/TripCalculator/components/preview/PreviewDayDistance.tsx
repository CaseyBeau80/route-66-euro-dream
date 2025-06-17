
import React from 'react';

interface PreviewDayDistanceProps {
  distance: number;
  driveTime: number;
}

const PreviewDayDistance: React.FC<PreviewDayDistanceProps> = ({ distance, driveTime }) => {
  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}m`;
  };

  const getStatusBadge = () => {
    if (driveTime >= 8) {
      return (
        <div className="text-xs text-orange-600 font-semibold mt-1 bg-orange-50 px-2 py-1 rounded">
          ⚠️ Long Drive Day
        </div>
      );
    }
    if (driveTime > 6 && driveTime < 8) {
      return (
        <div className="text-xs text-blue-600 mt-1">
          🚗 Extended Drive
        </div>
      );
    }
    return (
      <div className="text-xs text-green-600 mt-1">
        ✅ Comfortable Drive
      </div>
    );
  };

  return (
    <div className="text-right">
      <div className="text-2xl font-bold text-blue-600 mb-1">
        {Math.round(distance)} mi
      </div>
      <div className="text-sm text-gray-500">
        {formatTime(driveTime)} drive time
      </div>
      {getStatusBadge()}
    </div>
  );
};

export default PreviewDayDistance;
