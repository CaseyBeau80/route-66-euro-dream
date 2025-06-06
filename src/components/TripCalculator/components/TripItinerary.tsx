
import React from 'react';
import { Calendar, MapPin, Clock, Route, Cloud } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import { useUnits } from '@/contexts/UnitContext';
import DaySegmentCard from './DaySegmentCard';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import ErrorBoundary from './ErrorBoundary';

interface TripItineraryProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const TripItinerary: React.FC<TripItineraryProps> = ({ tripPlan, tripStartDate }) => {
  const { formatDistance } = useUnits();
  
  // Use stable segments to prevent cascading re-renders
  const stableSegments = useStableSegments(tripPlan.segments || tripPlan.dailySegments || []);
  
  console.log('📋 TripItinerary render with separate weather section:', {
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
              Daily Itinerary
            </h3>
            <span className="text-sm text-route66-text-secondary">
              Streamlined overview of your {tripPlan.totalDays}-day Route 66 adventure
            </span>
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

        {/* Two-column layout: Route & Stops | Weather Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Route & Stops */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-gray-700 mb-2">Route & Stops</h4>
              <div className="text-sm text-gray-600">
                {stableSegments.length} of {stableSegments.length} collapsed
              </div>
            </div>
            
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

          {/* Right Column - Weather Forecast */}
          {tripStartDate && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center justify-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Weather Forecast
                </h4>
                <div className="text-sm text-gray-600">
                  Expand All
                </div>
              </div>
              
              {stableSegments.map((segment, index) => (
                <ErrorBoundary key={`weather-${segment.day}-${index}`} context={`TripItinerary-Weather-${index}`}>
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-800">
                        Weather in {segment.endCity}
                      </h5>
                      <div className="text-sm text-gray-600">
                        Day {segment.day}<br />
                        {format(addDays(tripStartDate, segment.day - 1), 'MMM d')}
                      </div>
                    </div>
                    <SegmentWeatherWidget 
                      segment={segment}
                      tripStartDate={tripStartDate}
                      cardIndex={index}
                      tripId={tripPlan.title || 'trip'}
                      sectionKey={`weather-${segment.day}`}
                      forceExpanded={true}
                    />
                  </div>
                </ErrorBoundary>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TripItinerary;
