import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import TripItineraryColumn from './TripItineraryColumn';
import SimpleWeatherForecastColumn from './SimpleWeatherForecastColumn';
import WeatherTabContent from './WeatherTabContent';
import CostEstimateColumn from './CostEstimateColumn';
import ItineraryPreLoader from './ItineraryPreLoader';
import ErrorBoundary from './ErrorBoundary';
interface TripItineraryProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  loadingState?: {
    isPreLoading: boolean;
    progress: number;
    currentStep: string;
    totalSegments: number;
    loadedSegments: number;
    isReady: boolean;
  };
}
const TripItinerary: React.FC<TripItineraryProps> = ({
  tripPlan,
  tripStartDate,
  loadingState
}) => {
  // Validate tripStartDate
  const validatedTripStartDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    if (!(tripStartDate instanceof Date)) return undefined;
    if (isNaN(tripStartDate.getTime())) return undefined;
    return tripStartDate;
  }, [tripStartDate]);

  // Track readiness for progressive reveal
  const [isContentReady, setIsContentReady] = React.useState(false);
  React.useEffect(() => {
    if (loadingState?.isReady && !loadingState.isPreLoading) {
      // Small delay for smooth transition after pre-loader
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, 200);
      return () => clearTimeout(timer);
    } else if (!loadingState) {
      // No loading state means immediate readiness
      setIsContentReady(true);
    }
  }, [loadingState?.isReady, loadingState?.isPreLoading, loadingState]);
  console.log('🎯 [WEATHER DEBUG] TripItinerary rendered:', {
    component: 'TripItinerary',
    segmentsCount: tripPlan.segments.length,
    hasStartDate: !!validatedTripStartDate,
    startDate: validatedTripStartDate?.toISOString(),
    isPreLoading: loadingState?.isPreLoading,
    isContentReady,
    segments: tripPlan.segments.map(s => ({
      day: s.day,
      endCity: s.endCity
    }))
  });

  // Show loading if still pre-loading
  if (loadingState?.isPreLoading || !isContentReady) {
    return <div className="w-full max-w-6xl mx-auto">
        <ItineraryPreLoader progress={loadingState?.progress || 90} currentStep={loadingState?.currentStep || 'Finalizing your itinerary...'} totalSegments={loadingState?.totalSegments || tripPlan.segments.length} loadedSegments={loadingState?.loadedSegments || 0} />
      </div>;
  }
  return <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="itinerary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="itinerary">Daily Itinerary</TabsTrigger>
          <TabsTrigger value="weather">Weather Forecast</TabsTrigger>
          
          
        </TabsList>

        <TabsContent value="itinerary" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ErrorBoundary context="TripItineraryColumn">
              <TripItineraryColumn segments={tripPlan.segments} tripStartDate={validatedTripStartDate} loadingState={loadingState} />
            </ErrorBoundary>
            
            <ErrorBoundary context="SimpleWeatherForecastColumn">
              {(() => {
              console.log('🎯 [WEATHER DEBUG] About to render SimpleWeatherForecastColumn:', {
                component: 'TripItinerary -> SimpleWeatherForecastColumn',
                segmentsCount: tripPlan.segments.length,
                tripStartDate: validatedTripStartDate?.toISOString(),
                tripId: tripPlan.id
              });
              return null;
            })()}
              <SimpleWeatherForecastColumn segments={tripPlan.segments} tripStartDate={validatedTripStartDate} tripId={tripPlan.id} />
            </ErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <ErrorBoundary context="WeatherTabContent">
            <WeatherTabContent segments={tripPlan.segments} tripStartDate={validatedTripStartDate} tripId={tripPlan.id} isVisible={true} />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="costs" className="mt-6">
          <ErrorBoundary context="CostEstimateColumn">
            <CostEstimateColumn segments={tripPlan.segments} />
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
                {validatedTripStartDate ? <p className="text-sm text-gray-600">
                    Starting: {validatedTripStartDate.toLocaleDateString()}
                  </p> : <p className="text-sm text-gray-500">
                    Set a start date for detailed planning
                  </p>}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};
export default TripItinerary;