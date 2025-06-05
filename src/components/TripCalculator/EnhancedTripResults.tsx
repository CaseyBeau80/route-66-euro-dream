
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Camera, Star, ArrowRight } from 'lucide-react';
import { TripPlan, DailySegment, TripStop, SubStopTiming } from './services/Route66TripPlannerService';
import ShareTripActions from './ShareTripActions';

interface EnhancedTripResultsProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
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

const SubStopTimingCard: React.FC<{ timing: SubStopTiming }> = ({ timing }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-route66-vintage-beige rounded border border-route66-tan text-xs">
      <div className="flex-1 text-route66-vintage-brown font-semibold">
        {timing.fromStop.name}
      </div>
      <div className="flex items-center gap-1 text-route66-vintage-brown">
        <ArrowRight className="h-3 w-3" />
        <span className="font-mono">{timing.distanceMiles}mi</span>
        <span className="text-route66-text-muted">•</span>
        <Clock className="h-3 w-3" />
        <span className="font-mono">{formatDriveTime(timing.driveTimeHours)}</span>
      </div>
      <div className="flex-1 text-right text-route66-vintage-brown font-semibold">
        {timing.toStop.name}
      </div>
    </div>
  );
};

const StopCard: React.FC<{ stop: TripStop }> = ({ stop }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'route66_waypoint': return 'bg-route66-red text-white';
      case 'destination_city': return 'bg-route66-orange text-white';
      case 'attraction': return 'bg-route66-vintage-blue text-white';
      case 'hidden_gem': return 'bg-route66-vintage-green text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'route66_waypoint': return <MapPin className="h-3 w-3" />;
      case 'destination_city': return <Star className="h-3 w-3" />;
      case 'attraction': return <Camera className="h-3 w-3" />;
      case 'hidden_gem': return <Star className="h-3 w-3" />;
      default: return <MapPin className="h-3 w-3" />;
    }
  };

  console.log('🎯 Rendering StopCard:', stop);

  return (
    <div className="flex items-start gap-3 p-3 bg-route66-cream rounded-lg border border-route66-tan">
      {stop.image_url && (
        <img 
          src={stop.image_url} 
          alt={stop.name}
          className="w-16 h-12 object-cover rounded border border-route66-vintage-brown"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-travel font-bold text-route66-vintage-brown text-sm leading-tight">
            {stop.name}
          </h4>
          <Badge className={`${getCategoryColor(stop.category)} text-xs flex items-center gap-1 flex-shrink-0`}>
            {getCategoryIcon(stop.category)}
            {stop.category.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-xs text-route66-vintage-brown mt-1 leading-relaxed">
          {stop.description}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="h-3 w-3 text-route66-vintage-brown" />
          <span className="text-xs text-route66-vintage-brown">
            {stop.city_name}, {stop.state}
          </span>
        </div>
      </div>
    </div>
  );
};

const DaySegmentCard: React.FC<{ segment: DailySegment }> = ({ segment }) => {
  console.log('📅 Rendering DaySegmentCard:', segment);
  console.log('🚗 Sub-stop timings:', segment.subStopTimings);

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
          {/* Drive Time Breakdown - ALWAYS show if we have timings */}
          {segment.subStopTimings && segment.subStopTimings.length > 0 && (
            <div>
              <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 text-sm">
                Drive Time Breakdown ({segment.subStopTimings.length} segments)
              </h4>
              <div className="space-y-1">
                {segment.subStopTimings.map((timing, index) => (
                  <SubStopTimingCard key={`${timing.fromStop.id}-${timing.toStop.id}-${index}`} timing={timing} />
                ))}
              </div>
            </div>
          )}

          {/* Debug info for troubleshooting */}
          {(!segment.subStopTimings || segment.subStopTimings.length === 0) && (
            <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
              <strong>Debug:</strong> No sub-stop timings available. 
              Timings array: {segment.subStopTimings ? `length ${segment.subStopTimings.length}` : 'null/undefined'}
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

const EnhancedTripResults: React.FC<EnhancedTripResultsProps> = ({ tripPlan, shareUrl }) => {
  console.log('✨ Rendering EnhancedTripResults with tripPlan:', tripPlan);
  
  const fallbackImage = "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=300&h=200&fit=crop";

  return (
    <div className="space-y-6">
      {/* Trip Header with Images */}
      <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
        <CardHeader className="bg-gradient-to-r from-route66-orange to-route66-vintage-yellow text-white">
          <CardTitle className="font-route66 text-2xl text-center">
            {tripPlan.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-6 mb-6">
            <div className="flex-1 text-center">
              <div className="mb-3">
                <img 
                  src={tripPlan.startCityImage || fallbackImage} 
                  alt="Start City"
                  className="w-full h-32 object-cover rounded-lg border-2 border-route66-vintage-brown"
                />
              </div>
              <h3 className="font-route66 text-lg text-route66-vintage-red">Starting Point</h3>
              <p className="text-sm text-route66-vintage-brown">{tripPlan.dailySegments[0]?.startCity || "Unknown"}</p>
            </div>
            
            <div className="flex-shrink-0 text-center px-4">
              <div className="bg-route66-red text-white rounded-full px-4 py-2 font-route66 text-lg">
                {tripPlan.totalDays} DAYS
              </div>
              <div className="mt-2 text-route66-vintage-brown font-travel text-sm">
                {tripPlan.totalMiles} miles
              </div>
            </div>
            
            <div className="flex-1 text-center">
              <div className="mb-3">
                <img 
                  src={tripPlan.endCityImage || fallbackImage} 
                  alt="End City"
                  className="w-full h-32 object-cover rounded-lg border-2 border-route66-vintage-brown"
                />
              </div>
              <h3 className="font-route66 text-lg text-route66-vintage-red">Destination</h3>
              <p className="text-sm text-route66-vintage-brown">{tripPlan.dailySegments[tripPlan.dailySegments.length-1]?.endCity || "Unknown"}</p>
            </div>
          </div>

          {/* Share Actions */}
          <ShareTripActions shareUrl={shareUrl} tripTitle={tripPlan.title} />
        </CardContent>
      </Card>

      {/* Daily Segments */}
      <div className="space-y-4">
        <h3 className="font-travel font-bold text-route66-vintage-brown text-xl">
          Daily Itinerary
        </h3>
        <div className="grid gap-4">
          {tripPlan.dailySegments.length > 0 ? (
            tripPlan.dailySegments.map((segment) => (
              <DaySegmentCard key={segment.day} segment={segment} />
            ))
          ) : (
            <p className="text-center p-4 italic text-route66-vintage-brown">
              No daily segments available for this trip plan.
            </p>
          )}
        </div>
      </div>

      {/* Travel Tips */}
      <div className="mt-6 p-4 bg-route66-vintage-yellow rounded-lg border-2 border-route66-vintage-brown">
        <p className="text-sm text-route66-navy font-travel text-center">
          💡 <strong>Smart Route Planning:</strong> This itinerary shows drive times between each stop. 
          Times are based on 55mph average speed and may vary based on traffic, road conditions, and how long 
          you spend at each location. Don't forget to check attraction hours and seasonal availability!
        </p>
      </div>
    </div>
  );
};

export default EnhancedTripResults;
