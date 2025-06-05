
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, Gem, Camera, Coffee } from 'lucide-react';
import StopCard from './StopCard';

interface SegmentDetailsBreakdownProps {
  segment: DailySegment;
  isExpanded: boolean;
}

const SegmentDetailsBreakdown: React.FC<SegmentDetailsBreakdownProps> = ({ 
  segment, 
  isExpanded 
}) => {
  if (!isExpanded) return null;

  // Categorize recommended stops
  const categorizedStops = {
    attractions: segment.recommendedStops.filter(stop => stop.category === 'attraction'),
    waypoints: segment.recommendedStops.filter(stop => stop.category === 'route66_waypoint'),
    destinationCities: segment.recommendedStops.filter(stop => stop.category === 'destination_city'),
    hiddenGems: segment.recommendedStops.filter(stop => stop.category === 'hidden_gem')
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'attractions': return <Star className="h-4 w-4" />;
      case 'waypoints': return <MapPin className="h-4 w-4" />;
      case 'destinationCities': return <Coffee className="h-4 w-4" />;
      case 'hiddenGems': return <Gem className="h-4 w-4" />;
      default: return <Camera className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'attractions': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'waypoints': return 'bg-green-100 text-green-800 border-green-200';
      case 'destinationCities': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hiddenGems': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStopCategory = (
    categoryKey: keyof typeof categorizedStops,
    categoryName: string,
    stops: any[]
  ) => {
    if (stops.length === 0) return null;

    return (
      <div key={categoryKey} className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge className={`${getCategoryColor(categoryKey)} flex items-center gap-1`}>
            {getCategoryIcon(categoryKey)}
            {categoryName} ({stops.length})
          </Badge>
        </div>
        <div className="space-y-2 pl-4">
          {stops.map((stop) => (
            <StopCard key={stop.id} stop={stop} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Route Statistics */}
      <Card className="border border-route66-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-route66-text-primary">
            <Clock className="h-4 w-4" />
            Segment Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-800">
                {segment.approximateMiles}
              </div>
              <div className="text-xs text-blue-600">Total Miles</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-800">
                {segment.driveTimeHours.toFixed(1)}h
              </div>
              <div className="text-xs text-green-600">Drive Time</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-lg font-bold text-purple-800">
                {segment.recommendedStops.length}
              </div>
              <div className="text-xs text-purple-600">Stops</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-lg font-bold text-orange-800">
                {segment.subStopTimings?.length || 0}
              </div>
              <div className="text-xs text-orange-600">Segments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorized Stops */}
      {segment.recommendedStops.length > 0 && (
        <Card className="border border-route66-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-route66-text-primary">
              <MapPin className="h-4 w-4" />
              Recommended Stops by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {renderStopCategory('attractions', 'Major Attractions', categorizedStops.attractions)}
              {renderStopCategory('destinationCities', 'Cities & Towns', categorizedStops.destinationCities)}
              {renderStopCategory('waypoints', 'Route 66 Waypoints', categorizedStops.waypoints)}
              {renderStopCategory('hiddenGems', 'Hidden Gems', categorizedStops.hiddenGems)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route Timing Details */}
      {segment.subStopTimings && segment.subStopTimings.length > 0 && (
        <Card className="border border-route66-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-route66-text-primary">
              <Clock className="h-4 w-4" />
              Detailed Timing Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {segment.subStopTimings.map((timing, index) => (
                <div 
                  key={`${timing.fromStop.id}-${timing.toStop.id}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-route66-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {timing.fromStop.name} → {timing.toStop.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {timing.distance.toFixed(1)} miles
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {timing.driveTimeHours < 1 
                        ? `${Math.round(timing.driveTimeHours * 60)}m`
                        : `${timing.driveTimeHours.toFixed(1)}h`
                      }
                    </div>
                    <div className="text-xs text-gray-600">Drive Time</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SegmentDetailsBreakdown;
