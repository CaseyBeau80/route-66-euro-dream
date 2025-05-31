
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RouteStatisticsOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
}

interface RouteStats {
  totalPoints: number;
  totalDistance: number;
  segments: number;
  averagePointsPerSegment: number;
}

const RouteStatisticsOverlay: React.FC<RouteStatisticsOverlayProps> = ({
  isVisible,
  onToggle
}) => {
  const [stats, setStats] = useState<RouteStats | null>(null);

  useEffect(() => {
    // Simulate getting stats from the global route service
    // In a real implementation, you'd get this from the UltraSmoothRouteRenderer
    const mockStats: RouteStats = {
      totalPoints: 1847,
      totalDistance: 2448.2,
      segments: 209,
      averagePointsPerSegment: 8.8
    };
    
    setTimeout(() => {
      setStats(mockStats);
    }, 2000);
  }, []);

  if (!isVisible || !stats) return null;

  return (
    <div className="absolute top-4 left-4 z-50 animate-fade-in">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              🛣️ Route 66 Statistics
            </h3>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>
          
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
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteStatisticsOverlay;
