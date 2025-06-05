
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Route } from 'lucide-react';
import { DailySegment } from '../services/Route66TripPlannerService';
import SubStopTimingCard from './SubStopTimingCard';
import StopCard from './StopCard';

interface DaySegmentCardProps {
  segment: DailySegment;
}

const formatDriveTime = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}m`;
  }
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
};

const DaySegmentCard: React.FC<DaySegmentCardProps> = ({ segment }) => {
  console.log('📅 Rendering DaySegmentCard:', segment);
  console.log('🚗 Sub-stop timings:', segment.subStopTimings);

  const hasValidTimings = segment.subStopTimings && Array.isArray(segment.subStopTimings) && segment.subStopTimings.length > 0;

  return (
    <Card className="border-2 border-route66-vintage-brown bg-route66-vintage-beige">
      <CardHeader className="pb-3">
        <CardTitle className="font-route66 text-lg text-route66-vintage-red">
          {segment.title}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-route66-vintage-brown">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{segment.approximateMiles} miles</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>~{formatDriveTime(segment.driveTimeHours)} total</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Route Progression - Show drive times between stops */}
          {hasValidTimings ? (
            <div>
              <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 text-sm flex items-center gap-1">
                <Route className="h-4 w-4" />
                Route Progression ({segment.subStopTimings.length} segments)
              </h4>
              <div className="space-y-1">
                {segment.subStopTimings.map((timing, index) => (
                  <SubStopTimingCard 
                    key={`timing-${segment.day}-${index}-${timing.fromStop.id}-${timing.toStop.id}`} 
                    timing={timing} 
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-route66-vintage-yellow rounded border border-route66-vintage-brown">
              <div className="flex items-center gap-2 text-sm text-route66-vintage-brown">
                <Route className="h-4 w-4" />
                <span className="font-travel font-bold">Direct Route:</span>
                <span>{segment.startCity} → {segment.endCity}</span>
                <span className="text-route66-text-muted">•</span>
                <span>{formatDriveTime(segment.driveTimeHours)}</span>
              </div>
            </div>
          )}

          {/* Recommended Stops */}
          <div>
            <h4 className="font-travel font-bold text-route66-vintage-brown mb-2">
              Recommended Stops ({segment.recommendedStops.length})
            </h4>
            {segment.recommendedStops.length > 0 ? (
              <div className="space-y-2">
                {segment.recommendedStops.map((stop) => (
                  <StopCard key={stop.id} stop={stop} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-route66-vintage-brown italic">
                Direct drive - no specific stops planned for this segment
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DaySegmentCard;
