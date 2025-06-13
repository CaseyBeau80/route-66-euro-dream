
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import TripItineraryColumn from './TripItineraryColumn';
import WeatherTabContent from './WeatherTabContent';
import CostEstimateColumn from './CostEstimateColumn';
import ErrorBoundary from './ErrorBoundary';
import PerformanceCircuitBreaker from './PerformanceCircuitBreaker';

interface TripItineraryProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const TripItinerary: React.FC<TripItineraryProps> = React.memo(({ tripPlan, tripStartDate }) => {
  const [activeTab, setActiveTab] = React.useState('itinerary');
  const [isRendering, setIsRendering] = React.useState(false);
  const [visibleSegmentCount, setVisibleSegmentCount] = React.useState(1); // NUCLEAR: Start with only 1 segment

  // 🚨 NUCLEAR OPTION: Extremely aggressive segment limiting
  const renderCount = React.useRef(0);
  React.useEffect(() => {
    renderCount.current += 1;
    if (renderCount.current > 5) {
      console.error('🚨 NUCLEAR: TripItinerary rendering too many times, emergency stop!');
    }
  });

  // Validate tripStartDate once and memoize it
  const validatedTripStartDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    if (!(tripStartDate instanceof Date)) return undefined;
    if (isNaN(tripStartDate.getTime())) return undefined;
    return tripStartDate;
  }, [tripStartDate]);

  // 🚨 NUCLEAR: Ultra-conservative segment limiting
  const nuclearLimitedSegments = React.useMemo(() => {
    const segments = tripPlan.segments || [];
    
    // NUCLEAR: Never show more than the visible count initially
    const limitedSegments = segments.slice(0, visibleSegmentCount);
    
    console.log('🚨 NUCLEAR: Ultra-conservative segment limiting:', {
      totalSegments: segments.length,
      visibleCount: visibleSegmentCount,
      renderingCount: limitedSegments.length
    });
    
    return limitedSegments;
  }, [tripPlan.segments, visibleSegmentCount]);

  // 🚨 NUCLEAR: Prevent rendering if too many segments total
  if ((tripPlan.segments?.length || 0) > 15) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 text-center bg-red-50 border-2 border-red-200 rounded-lg">
        <h3 className="text-xl font-bold text-red-800 mb-4">⚠️ Trip Too Large</h3>
        <p className="text-red-700 mb-4">
          This trip has {tripPlan.segments?.length} segments. For performance, please plan a shorter trip (maximum 15 days).
        </p>
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    console.log('🔄 TripItinerary: Tab change to', value);
    setIsRendering(true);
    setActiveTab(value);
    
    // Reset rendering flag after a delay
    setTimeout(() => setIsRendering(false), 1000);
  };

  const loadMoreSegments = () => {
    const maxSegments = tripPlan.segments?.length || 0;
    const newCount = Math.min(visibleSegmentCount + 2, maxSegments);
    
    console.log('🔄 Loading more segments:', {
      current: visibleSegmentCount,
      new: newCount,
      max: maxSegments
    });
    
    setVisibleSegmentCount(newCount);
  };

  const hasMoreSegments = visibleSegmentCount < (tripPlan.segments?.length || 0);

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
              {/* 🚨 NUCLEAR: Ultra-safe itinerary rendering */}
              <PerformanceCircuitBreaker componentName="TripItineraryColumn" maxErrors={1}>
                <ErrorBoundary context="TripItineraryColumn">
                  <TripItineraryColumn 
                    segments={nuclearLimitedSegments} 
                    tripStartDate={validatedTripStartDate} 
                  />
                  
                  {/* Load More Button */}
                  {hasMoreSegments && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={loadMoreSegments}
                        className="px-6 py-3 bg-route66-primary text-white rounded-lg hover:bg-route66-primary-dark transition-colors"
                      >
                        Load More Days ({visibleSegmentCount}/{tripPlan.segments?.length || 0})
                      </button>
                    </div>
                  )}
                </ErrorBoundary>
              </PerformanceCircuitBreaker>
              
              {/* 🚨 NUCLEAR: No weather on itinerary tab - redirect only */}
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Weather Information</h3>
                <p className="text-yellow-700 text-sm mb-4">
                  Weather forecasts are available on the dedicated Weather tab to prevent performance issues.
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
              <ErrorBoundary context="WeatherTabContent">
                <WeatherTabContent 
                  segments={nuclearLimitedSegments}
                  tripStartDate={validatedTripStartDate}
                  tripId={tripPlan.id}
                  isVisible={activeTab === 'weather'}
                />
                
                {/* Weather Load More */}
                {hasMoreSegments && activeTab === 'weather' && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={loadMoreSegments}
                      className="px-6 py-3 bg-route66-primary text-white rounded-lg hover:bg-route66-primary-dark transition-colors"
                    >
                      Load More Weather ({visibleSegmentCount}/{tripPlan.segments?.length || 0})
                    </button>
                  </div>
                )}
              </ErrorBoundary>
            </PerformanceCircuitBreaker>
          )}
        </TabsContent>

        <TabsContent value="costs" className="mt-6">
          {!isRendering && (
            <PerformanceCircuitBreaker componentName="CostEstimateColumn" maxErrors={1}>
              <ErrorBoundary context="CostEstimateColumn">
                <CostEstimateColumn segments={nuclearLimitedSegments} />
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
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                  <p className="text-red-800 font-medium">🚨 Nuclear Performance Mode</p>
                  <p className="text-red-700">
                    Showing {visibleSegmentCount} of {tripPlan.segments?.length || 0} segments initially
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
