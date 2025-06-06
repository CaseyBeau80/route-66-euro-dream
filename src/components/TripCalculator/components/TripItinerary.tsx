
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import RouteAndStopsColumn from './RouteAndStopsColumn';
import WeatherForecastColumn from './WeatherForecastColumn';
import ErrorBoundary from './ErrorBoundary';

interface TripItineraryProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const TripItinerary: React.FC<TripItineraryProps> = ({ tripPlan, tripStartDate }) => {
  // Use stable segments to prevent cascading re-renders
  const stableSegments = useStableSegments(tripPlan.segments || tripPlan.dailySegments || []);
  
  console.log('📋 TripItinerary render with refined two-column layout:', {
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
        {/* Unified Header - Spans Both Columns */}
        <div className="bg-route66-background-alt rounded-lg border border-route66-border p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-6 w-6 text-route66-primary" />
            <h3 className="text-xl font-bold text-route66-text-primary">
              Daily Itinerary
            </h3>
          </div>
          <p className="text-sm text-route66-text-secondary ml-9">
            Complete overview of your {tripPlan.totalDays}-day Route 66 adventure
          </p>
        </div>

        {/* Two Column Layout with Aligned Day Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-fr">
          {/* Left Column - Route & Stops */}
          <div className="space-y-4">
            <ErrorBoundary context="RouteAndStopsColumn">
              <RouteAndStopsColumn
                segments={stableSegments}
                tripStartDate={tripStartDate}
                tripId={tripPlan.title || 'trip'}
              />
            </ErrorBoundary>
          </div>

          {/* Right Column - Weather Forecast */}
          <div className="space-y-4">
            <ErrorBoundary context="WeatherForecastColumn">
              <WeatherForecastColumn
                segments={stableSegments}
                tripStartDate={tripStartDate}
                tripId={tripPlan.title || 'trip'}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TripItinerary;
