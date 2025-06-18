
import React from 'react';
import { Route, Clock, MapPin, Navigation } from 'lucide-react';
import { useUnits } from '@/contexts/UnitContext';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { DataStandardizationService } from '@/services/DataStandardizationService';

interface DaySegmentCardStatsProps {
  segment: DailySegment;
  formattedDriveTime: string;
  segmentDistance: number;
  driveTimeStyle: {
    bg: string;
    text: string;
    border: string;
  };
}

const DaySegmentCardStats: React.FC<DaySegmentCardStatsProps> = ({
  segment,
  formattedDriveTime,
  segmentDistance,
  driveTimeStyle
}) => {
  const { preferences } = useUnits();
  
  // Standardize the data
  const standardizedDistance = DataStandardizationService.standardizeDistance(segmentDistance, preferences);
  const standardizedDriveTime = DataStandardizationService.standardizeDriveTime(segment.driveTimeHours);

  // Get accuracy indicator
  const getAccuracyBadge = () => {
    if (segment.isGoogleMapsData) {
      return (
        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
          🗺️ Google Maps
        </span>
      );
    }
    return (
      <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
        📐 Estimated
      </span>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-route66-cream border border-route66-border rounded-lg">
      {/* Distance */}
      <div className="text-center p-3 bg-white rounded border border-route66-border">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Route className="h-4 w-4 text-route66-primary" />
        </div>
        <div className="font-route66 text-lg text-route66-vintage-red mb-1">
          {standardizedDistance.formatted}
        </div>
        <div className="font-travel text-xs text-route66-vintage-brown">
          Total Distance
        </div>
        <div className="mt-2">
          {getAccuracyBadge()}
        </div>
      </div>
      
      {/* Drive Time */}
      <div className="text-center p-3 bg-white rounded border border-route66-border">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Clock className="h-4 w-4 text-route66-primary" />
        </div>
        <div className={`font-route66 text-lg mb-1 ${segment.driveTimeHours > 7 ? driveTimeStyle.text : 'text-route66-vintage-red'}`}>
          {standardizedDriveTime.formatted}
        </div>
        <div className="font-travel text-xs text-route66-vintage-brown">
          Drive Time
        </div>
        {segment.driveTimeHours > 7 && (
          <div className="text-xs text-orange-600 font-semibold mt-1 bg-orange-50 px-2 py-1 rounded">
            ⚠️ Long Drive
          </div>
        )}
      </div>
      
      {/* Start City */}
      <div className="text-center p-3 bg-white rounded border border-route66-border">
        <div className="flex items-center justify-center gap-1 mb-1">
          <MapPin className="h-4 w-4 text-route66-primary" />
        </div>
        <div className="font-travel text-sm font-bold text-route66-vintage-brown mb-1">
          🚗 From
        </div>
        <div className="font-travel text-xs text-route66-vintage-brown">
          {segment.startCity}
        </div>
      </div>
      
      {/* End City */}
      <div className="text-center p-3 bg-white rounded border border-route66-border">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Navigation className="h-4 w-4 text-route66-primary" />
        </div>
        <div className="font-travel text-sm font-bold text-route66-vintage-brown mb-1">
          🏁 To
        </div>
        <div className="font-travel text-xs text-route66-vintage-brown">
          {segment.endCity}
        </div>
      </div>
    </div>
  );
};

export default DaySegmentCardStats;
