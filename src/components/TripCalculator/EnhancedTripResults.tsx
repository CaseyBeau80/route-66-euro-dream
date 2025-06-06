
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar, DollarSign, Cloud } from 'lucide-react';
import { TripPlan } from './services/planning/TripPlanBuilder';
import TripItinerary from './components/TripItinerary';
import ShareTripButton from './components/ShareTripButton';
import SegmentWeatherWidget from './components/SegmentWeatherWidget';
import { format } from 'date-fns';
import { useUnits } from '@/contexts/UnitContext';

interface EnhancedTripResultsProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
}

const EnhancedTripResults: React.FC<EnhancedTripResultsProps> = ({
  tripPlan,
  shareUrl,
  tripStartDate
}) => {
  const { formatDistance } = useUnits();

  console.log("🌤️ EnhancedTripResults: Rendering with weather data for trip:", {
    segmentsCount: tripPlan.segments.length,
    hasStartDate: !!tripStartDate,
    startDate: tripStartDate?.toISOString()
  });

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const formatStartDate = (date?: Date): string => {
    if (!date) return 'Not specified';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Get the last segment for destination weather
  const lastSegment = tripPlan.segments[tripPlan.segments.length - 1];

  return (
    <div className="space-y-6">
      {/* Trip Overview Header */}
      <Card className="border-route66-border bg-gradient-to-r from-route66-vintage-beige to-white">
        <CardHeader className="text-center relative">
          {/* Share Trip Button - Absolute positioned in top-right */}
          <div className="absolute top-4 right-4">
            <ShareTripButton
              tripPlan={tripPlan}
              shareUrl={shareUrl}
              tripStartDate={tripStartDate}
              variant="primary"
              size="sm"
            />
          </div>
          
          <CardTitle className="text-2xl font-travel text-route66-primary flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6" />
            Your Route 66 Adventure
          </CardTitle>
          <p className="text-route66-text-secondary mt-2">
            {tripPlan.startCity} → {tripPlan.endCity}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-white rounded-lg border border-route66-border">
              <Calendar className="h-5 w-5 text-route66-primary mx-auto mb-1" />
              <div className="text-sm font-semibold text-route66-text-primary">{tripPlan.totalDays} Days</div>
              <div className="text-xs text-route66-text-secondary">Starting {formatStartDate(tripStartDate)}</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border border-route66-border">
              <MapPin className="h-5 w-5 text-route66-primary mx-auto mb-1" />
              <div className="text-sm font-semibold text-route66-text-primary">{formatDistance(tripPlan.totalDistance)}</div>
              <div className="text-xs text-route66-text-secondary">Total Distance</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border border-route66-border">
              <Clock className="h-5 w-5 text-route66-primary mx-auto mb-1" />
              <div className="text-sm font-semibold text-route66-text-primary">{formatTime(tripPlan.totalDrivingTime)}</div>
              <div className="text-xs text-route66-text-secondary">Drive Time</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border border-route66-border">
              <DollarSign className="h-5 w-5 text-route66-primary mx-auto mb-1" />
              <div className="text-sm font-semibold text-route66-text-primary">N/A</div>
              <div className="text-xs text-route66-text-secondary">Est. Cost</div>
            </div>
          </div>

          {/* Weather Information Section - Prominently displayed */}
          {tripStartDate && lastSegment && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Destination Weather</h3>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
                <SegmentWeatherWidget 
                  segment={lastSegment}
                  tripStartDate={tripStartDate}
                  cardIndex={0}
                  tripId="enhanced-results"
                  sectionKey="destination-weather"
                  forceExpanded={true}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Itinerary - NOW WITH PROPER TRIP START DATE */}
      <TripItinerary 
        tripPlan={tripPlan} 
        tripStartDate={tripStartDate}
      />
    </div>
  );
};

export default EnhancedTripResults;
