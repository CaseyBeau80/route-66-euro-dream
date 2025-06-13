
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import TripItineraryColumn from './TripItineraryColumn';
import SimpleWeatherForecastColumn from './SimpleWeatherForecastColumn';
import WeatherTabContent from './WeatherTabContent';
import CostEstimateColumn from './CostEstimateColumn';
import ErrorBoundary from './ErrorBoundary';
import SegmentLimiter from './SegmentLimiter';
import PerformanceCircuitBreaker from './PerformanceCircuitBreaker';

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

  // 🚨 CRASH PREVENTION: Log segment count for monitoring
  console.log('🚨 TripItinerary render - CRASH PREVENTION ACTIVE:', {
    segmentCount: memoizedSegments.length,
    totalDays: tripPlan.totalDays,
    hasValidStartDate: !!validatedTripStartDate,
    willUseLimiting: memoizedSegments.length > 3
  });

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
            {/* 🚨 CRASH PREVENTION: Wrap itinerary in segment limiter */}
            <PerformanceCircuitBreaker componentName="TripItineraryColumn" maxErrors={2}>
              <SegmentLimiter segments={memoizedSegments} initialLimit={3} incrementSize={5}>
                {(limitedSegments, hasMore, loadMore) => (
                  <>
                    <ErrorBoundary context="TripItineraryColumn">
                      <TripItineraryColumn 
                        segments={limitedSegments} 
                        tripStartDate={validatedTripStartDate} 
                      />
                    </ErrorBoundary>
                    {hasMore && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={loadMore}
                          className="text-sm text-route66-primary hover:text-route66-primary-dark underline"
                        >
                          Load more itinerary days...
                        </button>
                      </div>
                    )}
                  </>
                )}
              </SegmentLimiter>
            </PerformanceCircuitBreaker>
            
            {/* 🚨 CRASH PREVENTION: Wrap weather in circuit breaker */}
            <PerformanceCircuitBreaker componentName="SimpleWeatherForecastColumn" maxErrors={2}>
              <SegmentLimiter segments={memoizedSegments} initialLimit={3} incrementSize={5}>
                {(limitedSegments, hasMore, loadMore) => (
                  <>
                    <ErrorBoundary context="SimpleWeatherForecastColumn">
                      <SimpleWeatherForecastColumn 
                        segments={limitedSegments} 
                        tripStartDate={validatedTripStartDate}
                        tripId={tripPlan.id}
                      />
                    </ErrorBoundary>
                    {hasMore && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={loadMore}
                          className="text-sm text-route66-primary hover:text-route66-primary-dark underline"
                        >
                          Load more weather forecasts...
                        </button>
                      </div>
                    )}
                  </>
                )}
              </SegmentLimiter>
            </PerformanceCircuitBreaker>
          </div>
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <PerformanceCircuitBreaker componentName="WeatherTabContent" maxErrors={2}>
            <SegmentLimiter segments={memoizedSegments} initialLimit={5} incrementSize={7}>
              {(limitedSegments) => (
                <ErrorBoundary context="WeatherTabContent">
                  <WeatherTabContent 
                    segments={limitedSegments}
                    tripStartDate={validatedTripStartDate}
                    tripId={tripPlan.id}
                    isVisible={true}
                  />
                </ErrorBoundary>
              )}
            </SegmentLimiter>
          </PerformanceCircuitBreaker>
        </TabsContent>

        <TabsContent value="costs" className="mt-6">
          <PerformanceCircuitBreaker componentName="CostEstimateColumn" maxErrors={2}>
            <ErrorBoundary context="CostEstimateColumn">
              <CostEstimateColumn segments={memoizedSegments} />
            </ErrorBoundary>
          </PerformanceCircuitBreaker>
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
                {/* 🚨 CRASH PREVENTION: Show segment limiting info */}
                {memoizedSegments.length > 10 && (
                  <p className="text-sm text-orange-600 mt-2">
                    ⚡ Large trip detected - segments are loaded progressively for performance
                  </p>
                )}
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
