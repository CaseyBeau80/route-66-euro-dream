
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import TripItineraryColumn from './TripItineraryColumn';
import WeatherTabContent from './WeatherTabContent';
import CostEstimateColumn from './CostEstimateColumn';
import ErrorBoundary from './ErrorBoundary';
import PerformanceCircuitBreaker from './PerformanceCircuitBreaker';

interface TripItineraryContentProps {
  activeTab: string;
  isRendering: boolean;
  limitedSegments: any[];
  validatedTripStartDate: Date | undefined;
  hasMoreSegments: boolean;
  loadMoreSegments: () => void;
  tripPlan: TripPlan;
  handleTabChange: (value: string) => void;
}

const TripItineraryContent: React.FC<TripItineraryContentProps> = ({
  activeTab,
  isRendering,
  limitedSegments,
  validatedTripStartDate,
  hasMoreSegments,
  loadMoreSegments,
  tripPlan,
  handleTabChange
}) => {
  return (
    <>
      {isRendering && (
        <div className="mt-6 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-route66-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      )}

      <TabsContent value="itinerary" className="mt-6">
        {!isRendering && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceCircuitBreaker componentName="TripItineraryColumn" maxErrors={1}>
              <ErrorBoundary context="TripItineraryColumn">
                <TripItineraryColumn 
                  segments={limitedSegments} 
                  tripStartDate={validatedTripStartDate} 
                />
                
                {hasMoreSegments && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={loadMoreSegments}
                      className="px-6 py-3 bg-route66-primary text-white rounded-lg hover:bg-route66-primary-dark transition-colors"
                    >
                      Load More Days ({limitedSegments.length}/{tripPlan.segments?.length || 0})
                    </button>
                  </div>
                )}
              </ErrorBoundary>
            </PerformanceCircuitBreaker>
            
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
                segments={limitedSegments}
                tripStartDate={validatedTripStartDate}
                tripId={tripPlan.id}
                isVisible={activeTab === 'weather'}
              />
              
              {hasMoreSegments && activeTab === 'weather' && (
                <div className="mt-6 text-center">
                  <button
                    onClick={loadMoreSegments}
                    className="px-6 py-3 bg-route66-primary text-white rounded-lg hover:bg-route66-primary-dark transition-colors"
                  >
                    Load More Weather ({limitedSegments.length}/{tripPlan.segments?.length || 0})
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
              <CostEstimateColumn segments={limitedSegments} />
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
                  Showing {limitedSegments.length} of {tripPlan.segments?.length || 0} segments initially
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
    </>
  );
};

export default TripItineraryContent;
