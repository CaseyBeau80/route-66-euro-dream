
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import TripItineraryColumn from './TripItineraryColumn';
import WeatherForecastColumn from './WeatherForecastColumn';
import WeatherTabContent from './WeatherTabContent';
import CostEstimateColumn from './CostEstimateColumn';
import ErrorBoundary from './ErrorBoundary';

interface TripItineraryProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const TripItinerary: React.FC<TripItineraryProps> = ({ tripPlan, tripStartDate }) => {
  // 🚨 FORCE LOG: TripItinerary component render
  console.log('🚨 FORCE LOG: TripItinerary component rendering', {
    hasTripPlan: !!tripPlan,
    tripStartDate: tripStartDate?.toISOString(),
    tripStartDateType: typeof tripStartDate,
    isValidDate: tripStartDate instanceof Date && !isNaN(tripStartDate.getTime()),
    segmentsCount: tripPlan?.segments?.length || 0,
    segments: tripPlan?.segments?.map(s => ({ day: s.day, endCity: s.endCity })) || [],
    timestamp: new Date().toISOString()
  });

  // CRITICAL DEBUG: Enhanced debugging for trip start date propagation
  React.useEffect(() => {
    console.log('🗓️ CRITICAL DEBUG - TripItinerary received tripStartDate:', {
      tripStartDate: tripStartDate?.toISOString(),
      tripStartDateType: typeof tripStartDate,
      isValidDate: tripStartDate instanceof Date && !isNaN(tripStartDate.getTime()),
      segmentsCount: tripPlan.segments.length,
      debug: 'TripItinerary component',
      rawTripStartDate: tripStartDate,
      segmentsList: tripPlan.segments.map(s => ({ day: s.day, endCity: s.endCity }))
    });

    // ADDITIONAL DEBUG: Check if we're getting the date at all
    if (!tripStartDate) {
      console.error('❌ CRITICAL - No tripStartDate provided to TripItinerary component!');
      console.log('🔍 TripItinerary props debug:', { tripPlan, tripStartDate });
    }
  }, [tripStartDate, tripPlan.segments.length]);

  // Validate tripStartDate and log any issues
  const validatedTripStartDate = React.useMemo(() => {
    console.log('🔍 VALIDATING tripStartDate in TripItinerary:', tripStartDate);
    
    if (!tripStartDate) {
      console.warn('⚠️ TripItinerary: No tripStartDate provided');
      return undefined;
    }

    if (!(tripStartDate instanceof Date)) {
      console.error('❌ TripItinerary: tripStartDate is not a Date object:', { 
        tripStartDate, 
        type: typeof tripStartDate 
      });
      return undefined;
    }

    if (isNaN(tripStartDate.getTime())) {
      console.error('❌ TripItinerary: tripStartDate is an invalid Date:', tripStartDate);
      return undefined;
    }

    console.log('✅ TripItinerary: Valid tripStartDate confirmed:', tripStartDate.toISOString());
    return tripStartDate;
  }, [tripStartDate]);

  // 🚨 FORCE LOG: Validated date result
  console.log('🚨 FORCE LOG: TripItinerary validated date result', {
    originalDate: tripStartDate?.toISOString(),
    validatedDate: validatedTripStartDate?.toISOString(),
    isValid: !!validatedTripStartDate,
    timestamp: new Date().toISOString()
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
            <ErrorBoundary context="TripItineraryColumn">
              <TripItineraryColumn segments={tripPlan.segments} tripStartDate={validatedTripStartDate} />
            </ErrorBoundary>
            
            <ErrorBoundary context="WeatherForecastColumn">
              <WeatherForecastColumn 
                segments={tripPlan.segments} 
                tripStartDate={validatedTripStartDate}
                tripId={tripPlan.id}
              />
            </ErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <ErrorBoundary context="WeatherTabContent">
            <WeatherTabContent 
              segments={tripPlan.segments}
              tripStartDate={validatedTripStartDate}
              tripId={tripPlan.id}
              isVisible={true}
            />
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
};

export default TripItinerary;
