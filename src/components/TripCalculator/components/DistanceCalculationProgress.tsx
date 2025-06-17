
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DistanceCalculationProgressProps {
  isVisible: boolean;
  current: number;
  total: number;
  currentSegment?: string;
  accuracy?: string;
}

const DistanceCalculationProgress: React.FC<DistanceCalculationProgressProps> = ({
  isVisible,
  current,
  total,
  currentSegment,
  accuracy = 'estimated'
}) => {
  if (!isVisible) return null;

  const percentage = total > 0 ? (current / total) * 100 : 0;
  const isGoogleMaps = accuracy === 'high';

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-800">
                Calculating Route Distances
              </span>
              <span className="text-xs text-blue-600">
                ({isGoogleMaps ? '🗺️ Google Maps' : '📐 Estimated'})
              </span>
            </div>
            <span className="text-xs text-blue-600">
              {current} of {total}
            </span>
          </div>
          
          <Progress 
            value={percentage} 
            className="h-2 bg-blue-100"
          />
          
          {currentSegment && (
            <p className="text-xs text-blue-700">
              📍 Calculating: {currentSegment}
            </p>
          )}
          
          <div className="text-xs text-blue-600">
            {isGoogleMaps ? (
              <p>✅ Using Google Maps for accurate distance and drive times</p>
            ) : (
              <p>📊 Using estimated calculations (connect Google Maps API for higher accuracy)</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistanceCalculationProgress;
