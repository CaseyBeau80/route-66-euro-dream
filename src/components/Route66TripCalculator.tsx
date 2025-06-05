
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TripCalculatorForm from './TripCalculator/TripCalculatorForm';
import TripCalculatorResults from './TripCalculator/TripCalculatorResults';
import { useEnhancedTripCalculation } from './TripCalculator/hooks/useEnhancedTripCalculation';

const Route66TripCalculator: React.FC = () => {
  const {
    formData,
    setFormData,
    tripPlan,
    shareUrl,
    availableEndLocations,
    calculateTrip,
    isCalculating,
    isCalculateDisabled
  } = useEnhancedTripCalculation();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
        <CardHeader className="bg-gradient-to-r from-route66-red to-route66-orange text-white">
          <CardTitle className="font-route66 text-3xl text-center">
            🛣️ ROUTE 66 TRIP PLANNER
          </CardTitle>
          <p className="text-center text-route66-cream font-travel text-lg">
            Plan your authentic Route 66 adventure with real stops and attractions
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <TripCalculatorForm
            formData={formData}
            setFormData={setFormData}
            onCalculate={calculateTrip}
            availableEndLocations={availableEndLocations}
            isCalculateDisabled={isCalculateDisabled}
            isCalculating={isCalculating}
          />
        </CardContent>
      </Card>

      {tripPlan && (
        <TripCalculatorResults tripPlan={tripPlan} shareUrl={shareUrl} />
      )}
    </div>
  );
};

export default Route66TripCalculator;
