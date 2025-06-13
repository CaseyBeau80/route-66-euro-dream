
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
  const [activeTab, setActiveTab] = React.useState('itinerary');
  const [isRendering, setIsRendering] = React.useState(false);

  // 🚨 EMERGENCY: Add render tracking to prevent infinite loops
  const renderCount = React.useRef(0);
  React.useEffect(() => {
    renderCount.current += 1;
    if (renderCount.current > 10) {
      console.error('🚨 EMERGENCY: TripItinerary rendering too many times, possible infinite loop!');
    }
  });

  // Validate tripStartDate once and memoize it
  const validatedTripStartDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    if (!(tripStartDate instanceof Date)) return undefined;
    if (isNaN(tripStartDate.getTime())) return undefined;
    return tripStartDate;
  }, [tripStartDate]);

  // 🚨 EMERGENCY: Severely limit segments to prevent lockup
  const emergencyLimitedSegments = React.useMemo(() => {
    const segments = tripPlan.segments || [];
    
    // EMERGENCY: Only show first 2 segments if more than 5 total
    if (segments.length > 5) {
      console.warn('🚨 EMERGENCY: Large trip detected, showing only first 2 segments to prevent lockup');
      return segments.slice(0, 2);
    }
    
    return segments.slice(0, 3); // Never show more than 3 initially
  }, [tripPlan.segments]);

  // 🚨 CRASH PREVENTION: Log segment count for monitoring
  console.log('🚨 TripItinerary render - EMERGENCY MODE ACTIVE:', {
    renderCount: renderCount.current,
    totalSegments: tripPlan.segments?.length || 0,
    emergencyLimitedCount: emergencyLimitedSegments.length,
    totalDays: tripPlan.totalDays,
    hasValidStartDate: !!validatedTripStartDate,
    activeTab,
    isRendering
  });

  // 🚨 EMERGENCY: Prevent rendering if too many segments
  if ((tripPlan.segments?.length || 0) > 20) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 text-center bg-red-50 border-2 border-red-200 rounded-lg">
        <h3 className="text-xl font-bold text-red-800 mb-4">⚠️ Large Trip Detected</h3>
        <p className="text-red-700 mb-4">
          This trip has {tripPlan.segments?.length} segments, which is too large to display safely.
        </p>
        <p className="text-red-600 text-sm">
          Please plan a shorter trip (maximum 20 days) to avoid performance issues.
        </p>
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    console.log('🔄 TripItinerary: Tab change to', value);
    setIsRendering(true);
    setActiveTab(value);
    
    // Reset rendering flag after a delay
    setTimeout(() => setIsRendering(false), 500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="itinerary">Daily Itinerary</TabsTrigger>
          <TabsTrigger value="weather">Weather Forecast</TabsTrigger>
          <TabsTrigger value="costs">Cost Estimates</TabsTrigger>
          <TabsTrigger value="overview">Trip Overview</TabsTrigger>
        </TabsList>

        {/* Show loading state during tab transitions */}
        {isRendering && (
          <div className="mt-6 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-route66-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        )}

        <TabsContent value="itinerary" className="mt-6">
          {!isRendering && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 🚨 EMERGENCY: Wrap itinerary in multiple safety layers */}
              <PerformanceCircuitBreaker componentName="TripItineraryColumn" maxErrors={1}>
                <SegmentLimiter segments={emergencyLimitedSegments} initialLimit={2} incrementSize={2}>
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
                            Load more itinerary days... ({limitedSegments.length}/{emergencyLimitedSegments.length})
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </SegmentLimiter>
              </PerformanceCircuitBreaker>
              
              {/* 🚨 EMERGENCY: Disable weather on itinerary tab to prevent lockup */}
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Weather Information</h3>
                <p className="text-yellow-700 text-sm mb-4">
                  Weather forecasts have been moved to the dedicated Weather tab to improve performance.
                </p>
                <button
                  onClick={() => handleTabChange('weather')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  View Weather Forecasts
                </button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          {!isRendering && (
            <PerformanceCircuitBreaker componentName="WeatherTabContent" maxErrors={1}>
              <SegmentLimiter segments={emergencyLimitedSegments} initialLimit={2} incrementSize={2}>
                {(limitedSegments) => (
                  <ErrorBoundary context="WeatherTabContent">
                    <WeatherTabContent 
                      segments={limitedSegments}
                      tripStartDate={validatedTripStartDate}
                      tripId={tripPlan.id}
                      isVisible={activeTab === 'weather'}
                    />
                  </ErrorBoundary>
                )}
              </SegmentLimiter>
            </PerformanceCircuitBreaker>
          )}
        </TabsContent>

        <TabsContent value="costs" className="mt-6">
          {!isRendering && (
            <PerformanceCircuitBreaker componentName="CostEstimateColumn" maxErrors={1}>
              <ErrorBoundary context="CostEstimateColumn">
                <CostEstimateColumn segments={emergencyLimitedSegments} />
              </ErrorBoundary>
            </PerformanceCircuitBreaker>
          )}
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
                {/* 🚨 EMERGENCY: Show performance info */}
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <p className="text-blue-800 font-medium">Performance Mode Active</p>
                  <p className="text-blue-700">
                    Showing {emergencyLimitedSegments.length} of {tripPlan.segments?.length || 0} segments
                  </p>
                </div>
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
