import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TripPlannerForm from './components/TripPlannerForm';
import TripCalculatorResults from '../TripCalculator/TripCalculatorResults';
import CostEstimatorSection from '../TripCalculator/components/CostEstimatorSection';
import { useTripCalculation } from './hooks/useTripCalculation';
import CoordinateErrorBoundary from '../TripCalculator/components/CoordinateErrorBoundary';
import { TripFormData } from '../TripCalculator/types/tripCalculator';

const Route66TripCalculator: React.FC = () => {
  const { tripPlan, isCalculating, planningResult, calculateTrip, resetTrip, formData, setFormData } = useTripCalculation();

  console.log('✨ Route66TripCalculator: Component mounted');

  // DEBUG: Log form data and trip start date to track the issue
  console.log('🔍 Route66TripCalculator: Form data debug:', {
    hasFormData: !!formData,
    tripStartDate: formData?.tripStartDate?.toISOString() || 'NULL',
    tripStartDateType: typeof formData?.tripStartDate,
    isValidDate: formData?.tripStartDate instanceof Date && !isNaN(formData.tripStartDate.getTime()),
    timestamp: new Date().toISOString()
  });

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

  const handlePlanTrip = async (data: TripFormData) => {
    console.log('🚀 Route66TripCalculator: Planning trip with data:', data);
    await calculateTrip(data);
  };

  const handleLocationChange = (type: 'start' | 'end', location: string) => {
    setFormData(prev => ({
      ...prev,
      [type === 'start' ? 'startLocation' : 'endLocation']: location
    }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      console.log('📅 Route66TripCalculator: Start date changed:', {
        newDate: date.toISOString(),
        isValid: !isNaN(date.getTime()),
        timestamp: new Date().toISOString()
      });
      setFormData(prev => ({ ...prev, tripStartDate: date }));
    }
  };

  const handleTravelDaysChange = (days: number) => {
    setFormData(prev => ({ ...prev, travelDays: days }));
  };

  const handleTripStyleChange = (style: 'destination-focused') => {
    setFormData(prev => ({ ...prev, tripStyle: style }));
  };

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
                formData={formData}
                onStartDateChange={handleStartDateChange}
                onLocationChange={handleLocationChange}
                onTravelDaysChange={handleTravelDaysChange}
                onTripStyleChange={handleTripStyleChange}
                onPlanTrip={handlePlanTrip}
                onResetTrip={resetTrip}
                isPlanning={isCalculating}
                tripPlan={tripPlan}
              />
            </CoordinateErrorBoundary>
          </CardContent>
        </Card>

        {/* Trip Results - FIXED: Add missing tripStartDate prop */}
        {(tripPlan || isCalculating) && (
          <CoordinateErrorBoundary 
            fallbackMessage="There was an issue displaying the trip results."
            onError={handleCoordinateError}
          >
            <TripCalculatorResults
              tripPlan={tripPlan}
              completionAnalysis={planningResult?.completionAnalysis}
              originalRequestedDays={planningResult?.originalRequestedDays}
              tripStartDate={formData.tripStartDate}
            />
          </CoordinateErrorBoundary>
        )}

        {/* Cost Estimator */}
        {tripPlan && (
          <CoordinateErrorBoundary 
            fallbackMessage="There was an issue with the cost estimator."
            onError={handleCoordinateError}
          >
            <CostEstimatorSection 
              formData={formData}
              tripPlan={tripPlan} 
            />
          </CoordinateErrorBoundary>
        )}
      </div>
    </CoordinateErrorBoundary>
  );
};

export default Route66TripCalculator;
