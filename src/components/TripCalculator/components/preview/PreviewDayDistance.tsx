
import React from 'react';
import { DataStandardizationService } from '@/services/DataStandardizationService';
import { useUnits } from '@/contexts/UnitContext';

interface PreviewDayDistanceProps {
  distance: number;
  driveTime: number;
  isGoogleMapsData?: boolean;
  dataAccuracy?: string;
}

const PreviewDayDistance: React.FC<PreviewDayDistanceProps> = ({ 
  distance, 
  driveTime, 
  isGoogleMapsData = false,
  dataAccuracy = 'estimated'
}) => {
  const { preferences } = useUnits();
  
  // Standardize the data
  const standardizedDistance = DataStandardizationService.standardizeDistance(distance, preferences);
  const standardizedDriveTime = DataStandardizationService.standardizeDriveTime(driveTime);

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

  const getAccuracyBadge = () => {
    if (isGoogleMapsData) {
      return (
        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded mt-1">
          🗺️ Google Maps
        </div>
      );
    }
    return (
      <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded mt-1">
        📐 Estimated
      </div>
    );
  };

  console.log('📏 ENHANCED: PreviewDayDistance with Google Maps integration:', {
    originalDistance: distance,
    originalDriveTime: driveTime,
    standardizedDistance,
    standardizedDriveTime,
    isGoogleMapsData,
    dataAccuracy,
    preferences: preferences.distance
  });

  return (
    <div className="text-right">
      <div className="text-2xl font-bold text-blue-600 mb-1">
        {standardizedDistance.formatted}
      </div>
      <div className="text-sm text-gray-500">
        {standardizedDriveTime.formatted} drive time
      </div>
      {getStatusBadge()}
      {getAccuracyBadge()}
    </div>
  );
};

export default PreviewDayDistance;
