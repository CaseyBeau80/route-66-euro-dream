
import React from 'react';
import { Calendar, MapPin, Clock, Route } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import { useUnits } from '@/contexts/UnitContext';
import DaySegmentCard from './DaySegmentCard';
import ErrorBoundary from './ErrorBoundary';

interface TripItineraryProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const TripItinerary: React.FC<TripItineraryProps> = ({ tripPlan, tripStartDate }) => {
  const { formatDistance } = useUnits();
  
  // Use stable segments to prevent cascading re-renders
  const stableSegments = useStableSegments(tripPlan.segments || tripPlan.dailySegments || []);
  
  console.log('📋 TripItinerary render:', {
    segmentsCount: stableSegments.length,
    tripStartDate: tripStartDate ? format(tripStartDate, 'yyyy-MM-dd') : 'Not set',
    totalDays: tripPlan.totalDays
  });

  if (!stableSegments || stableSegments.length === 0) {
    return (
      <div className="text-center p-8 bg-route66-background-alt rounded-lg border border-route66-border">
        <MapPin className="h-12 w-12 text-route66-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-route66-text-primary mb-2">
          No Itinerary Available
        </h3>
        <p className="text-route66-text-secondary">
          There was an issue generating your trip itinerary. Please try recalculating your trip.
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary context="TripItinerary">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-route66-background-alt rounded-lg border border-route66-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-6 w-6 text-route66-primary" />
            <h3 className="text-xl font-bold text-route66-text-primary">
              Day-by-Day Itinerary
            </h3>
          </div>
          
          {/* Trip Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-route66-primary" />
              <span className="text-route66-text-secondary">
                {tripPlan.totalDays} {tripPlan.totalDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-route66-primary" />
              <span className="text-route66-text-secondary">
                {formatDistance(tripPlan.totalDistance || tripPlan.totalMiles || 0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-route66-primary" />
              <span className="text-route66-text-secondary">
                {Math.round((tripPlan.totalDrivingTime || 0) * 10) / 10}h driving
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-route66-primary" />
              <span className="text-route66-text-secondary">
                {tripPlan.startCity} → {tripPlan.endCity}
              </span>
            </div>
          </div>
          
          {/* Trip Start Date */}
          {tripStartDate && (
            <div className="mt-4 p-3 bg-white rounded border border-route66-border">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-route66-primary" />
                <span className="text-route66-text-secondary">Trip starts on</span>
                <span className="font-medium text-route66-text-primary">
                  {format(tripStartDate, 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Daily Segments */}
        <div className="space-y-4">
          {stableSegments.map((segment, index) => (
            <ErrorBoundary key={`segment-${segment.day}-${index}`} context={`TripItinerary-Segment-${index}`}>
              <DaySegmentCard 
                segment={segment}
                tripStartDate={tripStartDate}
                cardIndex={index}
                tripId={tripPlan.title || 'trip'}
                sectionKey="itinerary"
              />
            </ErrorBoundary>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TripItinerary;
