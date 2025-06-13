
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import TripItineraryColumn from './TripItineraryColumn';
import SimpleWeatherForecastColumn from './SimpleWeatherForecastColumn';
import WeatherTabContent from './WeatherTabContent';
import CostEstimateColumn from './CostEstimateColumn';
import ErrorBoundary from './ErrorBoundary';

interface TripItineraryProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const TripItinerary: React.FC<TripItineraryProps> = React.memo(({ tripPlan, tripStartDate }) => {
  // Validate tripStartDate once and memoize it
  const validatedTripStartDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    if (!(tripStartDate instanceof Date)) return undefined;
    if (isNaN(tripStartDate.getTime())) return undefined;
    return tripStartDate;
  }, [tripStartDate]);

  // Memoize segments to prevent unnecessary re-renders
  const memoizedSegments = React.useMemo(() => tripPlan.segments, [tripPlan.segments]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="itinerary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="itinerary">Daily Itinerary</TabsTrigger>
          <TabsTrigger value="weather">Weather Forecast</TabsTrigger>
          <TabsTrigger value="costs">Cost Estimates</TabsTrigger>
          <TabsTrigger value="overview">Trip Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ErrorBoundary context="TripItineraryColumn">
              <TripItineraryColumn segments={memoizedSegments} tripStartDate={validatedTripStartDate} />
            </ErrorBoundary>
            
            <ErrorBoundary context="SimpleWeatherForecastColumn">
              <SimpleWeatherForecastColumn 
                segments={memoizedSegments} 
                tripStartDate={validatedTripStartDate}
                tripId={tripPlan.id}
              />
            </ErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <ErrorBoundary context="WeatherTabContent">
            <WeatherTabContent 
              segments={memoizedSegments}
              tripStartDate={validatedTripStartDate}
              tripId={tripPlan.id}
              isVisible={true}
            />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="costs" className="mt-6">
          <ErrorBoundary context="CostEstimateColumn">
            <CostEstimateColumn segments={memoizedSegments} />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-4">Trip Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Route Details</h4>
                <p className="text-sm text-gray-600">
                  From {tripPlan.startCity} to {tripPlan.endCity}
                </p>
                <p className="text-sm text-gray-600">
                  {tripPlan.totalDays} days, {Math.round(tripPlan.totalDistance)} miles
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Travel Information</h4>
                {validatedTripStartDate ? (
                  <p className="text-sm text-gray-600">
                    Starting: {validatedTripStartDate.toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Set a start date for detailed planning
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

TripItinerary.displayName = 'TripItinerary';

export default TripItinerary;
