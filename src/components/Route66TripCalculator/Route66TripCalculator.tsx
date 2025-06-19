
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TripPlannerForm from '../TripCalculator/components/TripPlannerForm';
import TripCalculatorResults from '../TripCalculator/TripCalculatorResults';
import CostEstimatorSection from '../TripCalculator/components/CostEstimatorSection';
import { useTripCalculation } from './hooks/useTripCalculation';
import CoordinateErrorBoundary from '../TripCalculator/components/CoordinateErrorBoundary';

const Route66TripCalculator: React.FC = () => {
  const { tripPlan, isCalculating, planningResult, calculateTrip, resetTrip } = useTripCalculation();

  console.log('✨ Route66TripCalculator: Component mounted');

  // PHASE 3: Custom error handler for coordinate errors
  const handleCoordinateError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('🚨 PHASE 3: Coordinate error captured in Route66TripCalculator:', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  };

  React.useEffect(() => {
    console.log('✨ Route66TripCalculator: Component mounted');
    return () => {
      console.log('✨ Route66TripCalculator: Component unmounted');
    };
  }, []);

  return (
    <CoordinateErrorBoundary 
      fallbackMessage="There was an issue with the trip calculator. This might be due to location data problems."
      onError={handleCoordinateError}
    >
      <div className="space-y-6">
        {/* Trip Planner Form */}
        <Card>
          <CardContent className="p-6">
            <CoordinateErrorBoundary 
              fallbackMessage="There was an issue with the trip planning form."
              onError={handleCoordinateError}
            >
              <TripPlannerForm
                onCalculateTrip={calculateTrip}
                isPlanning={isCalculating}
                onResetTrip={resetTrip}
              />
            </CoordinateErrorBoundary>
          </CardContent>
        </Card>

        {/* Trip Results */}
        {(tripPlan || isCalculating) && (
          <CoordinateErrorBoundary 
            fallbackMessage="There was an issue displaying the trip results."
            onError={handleCoordinateError}
          >
            <TripCalculatorResults
              tripPlan={tripPlan}
              completionAnalysis={planningResult?.completionAnalysis}
              originalRequestedDays={planningResult?.originalRequestedDays}
            />
          </CoordinateErrorBoundary>
        )}

        {/* Cost Estimator */}
        {tripPlan && (
          <CoordinateErrorBoundary 
            fallbackMessage="There was an issue with the cost estimator."
            onError={handleCoordinateError}
          >
            <CostEstimatorSection tripPlan={tripPlan} />
          </CoordinateErrorBoundary>
        )}
      </div>
    </CoordinateErrorBoundary>
  );
};

export default Route66TripCalculator;
