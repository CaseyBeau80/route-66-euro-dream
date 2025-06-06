
import React from 'react';

interface PDFDaySegmentCardStatsProps {
  distance: number;
  driveTimeHours: number;
  startCity?: string;
  endCity: string;
}

const PDFDaySegmentCardStats: React.FC<PDFDaySegmentCardStatsProps> = ({
  distance,
  driveTimeHours,
  startCity,
  endCity
}) => {
  const formatTime = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  return (
    <>
      {/* Card Stats */}
      <div className="pdf-card-stats grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-base">
          <span className="text-blue-600">🛣️</span>
          <span className="font-medium">{Math.round(distance)} mi</span>
        </div>
        <div className="flex items-center gap-2 text-base">
          <span className="text-blue-600">⏱️</span>
          <span className="font-medium">{formatTime(driveTimeHours)}</span>
        </div>
      </div>

      {/* Route Description */}
      {startCity && (
        <div className="pdf-route-description text-base text-gray-600 mb-4">
          <strong>Route:</strong> {startCity} → {endCity}
        </div>
      )}
    </>
  );
};

export default PDFDaySegmentCardStats;
