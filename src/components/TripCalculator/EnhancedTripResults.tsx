
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Camera, Star } from 'lucide-react';
import { TripPlan, DailySegment, TripStop } from './services/Route66TripPlannerService';

interface EnhancedTripResultsProps {
  tripPlan: TripPlan;
}

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
            <span>~{segment.driveTimeHours} hours</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
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

const EnhancedTripResults: React.FC<EnhancedTripResultsProps> = ({ tripPlan }) => {
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Segments */}
      <div className="space-y-4">
        <h3 className="font-travel font-bold text-route66-vintage-brown text-xl">
          Daily Itinerary
        </h3>
        <div className="grid gap-4">
          {tripPlan.dailySegments.map((segment) => (
            <DaySegmentCard key={segment.day} segment={segment} />
          ))}
        </div>
      </div>

      {/* Travel Tips */}
      <div className="mt-6 p-4 bg-route66-vintage-yellow rounded-lg border-2 border-route66-vintage-brown">
        <p className="text-sm text-route66-navy font-travel text-center">
          💡 <strong>Smart Route Planning:</strong> This itinerary is based on actual Route 66 stops, 
          attractions, and historic points of interest. Times may vary based on traffic and how long 
          you spend at each location. Don't forget to check attraction hours and seasonal availability!
        </p>
      </div>
    </div>
  );
};

export default EnhancedTripResults;
