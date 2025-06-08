
import React from 'react';

interface PDFDaySegmentCardStatsProps {
  distance: number;
  driveTimeHours?: number;
  startCity: string;
  endCity: string;
}

const PDFDaySegmentCardStats: React.FC<PDFDaySegmentCardStatsProps> = ({
  distance,
  driveTimeHours,
  startCity,
  endCity
}) => {
  const formatTime = (hours?: number): string => {
    if (!hours) return 'N/A';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <div className="pdf-day-stats grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="text-center p-3 bg-gray-50 rounded border">
        <div className="text-lg font-bold text-blue-600">
          🗺️ {Math.round(distance)}
        </div>
        <div className="text-xs text-gray-600">Miles</div>
      </div>
      
      <div className="text-center p-3 bg-gray-50 rounded border">
        <div className="text-lg font-bold text-purple-600">
          ⏱️ {formatTime(driveTimeHours)}
        </div>
        <div className="text-xs text-gray-600">Drive Time</div>
      </div>
      
      <div className="text-center p-3 bg-gray-50 rounded border">
        <div className="text-sm font-medium text-gray-700">
          🚗 From
        </div>
        <div className="text-xs text-gray-600">{startCity}</div>
      </div>
      
      <div className="text-center p-3 bg-gray-50 rounded border">
        <div className="text-sm font-medium text-gray-700">
          🏁 To
        </div>
        <div className="text-xs text-gray-600">{endCity}</div>
      </div>
    </div>
  );
};

export default PDFDaySegmentCardStats;
