
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RouteStatsHeader from './RouteStats/RouteStatsHeader';
import RouteStatsDisplay from './RouteStats/RouteStatsDisplay';
import { getMockRouteStats, type RouteStats } from './RouteStats/RouteStatsData';

interface RouteStatisticsOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
}

const RouteStatisticsOverlay: React.FC<RouteStatisticsOverlayProps> = ({
  isVisible,
  onToggle
}) => {
  const [stats, setStats] = useState<RouteStats | null>(null);

  useEffect(() => {
    // Simulate getting stats from the global route service
    // In a real implementation, you'd get this from the UltraSmoothRouteRenderer
    const mockStats = getMockRouteStats();
    
    setTimeout(() => {
      setStats(mockStats);
    }, 2000);
  }, []);

  if (!isVisible || !stats) return null;

  return (
    <div className="absolute top-4 left-4 z-50 animate-fade-in">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200">
        <CardContent className="p-4 space-y-3">
          <RouteStatsHeader onToggle={onToggle} />
          <RouteStatsDisplay stats={stats} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteStatisticsOverlay;
