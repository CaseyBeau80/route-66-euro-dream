
import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { RouteStats } from './RouteStatsData';

interface RouteStatsDisplayProps {
  stats: RouteStats;
}

const RouteStatsDisplay: React.FC<RouteStatsDisplayProps> = ({ stats }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Points:</span>
            <Badge variant="secondary" className="text-xs">
              {stats.totalPoints.toLocaleString()}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Distance:</span>
            <Badge variant="outline" className="text-xs">
              {stats.totalDistance.toFixed(0)} km
            </Badge>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Segments:</span>
            <Badge variant="secondary" className="text-xs">
              {stats.segments}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Avg Points:</span>
            <Badge variant="outline" className="text-xs">
              {stats.averagePointsPerSegment.toFixed(1)}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="pt-2 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
          <span>Ultra-smooth interpolation active</span>
        </div>
      </div>
    </>
  );
};

export default RouteStatsDisplay;
