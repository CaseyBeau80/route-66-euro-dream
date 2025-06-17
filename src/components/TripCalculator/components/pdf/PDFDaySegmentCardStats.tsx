
import React from 'react';
import { DataStandardizationService } from '@/services/DataStandardizationService';
import { useUnits } from '@/contexts/UnitContext';

interface PDFDaySegmentCardStatsProps {
  distance: number;
  driveTimeHours: number;
  startCity: string;
  endCity: string;
}

const PDFDaySegmentCardStats: React.FC<PDFDaySegmentCardStatsProps> = ({
  distance,
  driveTimeHours,
  startCity,
  endCity
}) => {
  const { preferences } = useUnits();
  
  // Standardize the data
  const standardizedDistance = DataStandardizationService.standardizeDistance(distance, preferences);
  const standardizedDriveTime = DataStandardizationService.standardizeDriveTime(driveTimeHours);

  console.log('📄 STANDARDIZED: PDFDaySegmentCardStats using unified formatting:', {
    originalDistance: distance,
    originalDriveTime: driveTimeHours,
    standardizedDistance,
    standardizedDriveTime,
    preferences: preferences.distance
  });

  return (
    <div className="pdf-stats-grid px-4 py-3 bg-route66-cream border-t border-route66-tan">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Distance */}
        <div className="text-center p-3 bg-white rounded border border-route66-border">
          <div className="font-route66 text-xl text-route66-vintage-red mb-1">
            {standardizedDistance.formatted}
          </div>
          <div className="font-travel text-xs text-route66-vintage-brown">
            Total Distance
          </div>
        </div>
        
        {/* Drive Time */}
        <div className="text-center p-3 bg-white rounded border border-route66-border">
          <div className="font-route66 text-xl text-route66-vintage-red mb-1">
            {standardizedDriveTime.formatted}
          </div>
          <div className="font-travel text-xs text-route66-vintage-brown">
            Drive Time
          </div>
        </div>
        
        {/* Start City */}
        <div className="text-center p-3 bg-white rounded border border-route66-border">
          <div className="font-travel text-sm font-bold text-route66-vintage-brown mb-1">
            🚗 From
          </div>
          <div className="font-travel text-xs text-route66-vintage-brown">
            {startCity}
          </div>
        </div>
        
        {/* End City */}
        <div className="text-center p-3 bg-white rounded border border-route66-border">
          <div className="font-travel text-sm font-bold text-route66-vintage-brown mb-1">
            🏁 To
          </div>
          <div className="font-travel text-xs text-route66-vintage-brown">
            {endCity}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFDaySegmentCardStats;
