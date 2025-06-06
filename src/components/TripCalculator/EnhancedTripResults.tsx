
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar, DollarSign } from 'lucide-react';
import { TripPlan } from './services/planning/TripPlanBuilder';
import TripItinerary from './components/TripItinerary';
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

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const formatStartDate = (date?: Date): string => {
    if (!date) return 'Not specified';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      {/* Trip Overview Header */}
      <Card className="border-route66-border bg-gradient-to-r from-route66-vintage-beige to-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-travel text-route66-primary flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6" />
            Your Route 66 Adventure
          </CardTitle>
          <p className="text-route66-text-secondary">
            {tripPlan.startCity} → {tripPlan.endCity}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="text-sm font-semibold text-route66-text-primary">{formatTime(tripPlan.totalDriveTime)}</div>
              <div className="text-xs text-route66-text-secondary">Drive Time</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border border-route66-border">
              <DollarSign className="h-5 w-5 text-route66-primary mx-auto mb-1" />
              <div className="text-sm font-semibold text-route66-text-primary">${tripPlan.estimatedCost?.toFixed(0) || 'N/A'}</div>
              <div className="text-xs text-route66-text-secondary">Est. Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <TripItinerary 
        tripPlan={tripPlan} 
        tripStartDate={tripStartDate}
        formatTime={formatTime}
        shareUrl={shareUrl}
      />
    </div>
  );
};

export default EnhancedTripResults;
