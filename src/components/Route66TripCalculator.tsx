
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTripCalculation } from './TripCalculator/hooks/useTripCalculation';
import TripCalculatorForm from './TripCalculator/TripCalculatorForm';
import TripCalculatorResults from './TripCalculator/TripCalculatorResults';

const Route66TripCalculator = () => {
  const {
    formData,
    setFormData,
    calculation,
    availableEndLocations,
    calculateTrip,
    isCalculateDisabled
  } = useTripCalculation();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
        <CardHeader className="bg-gradient-to-r from-route66-vintage-red to-route66-rust text-white">
          <CardTitle className="font-route66 text-2xl text-center">
            ROUTE 66 TRIP CALCULATOR
          </CardTitle>
          <p className="text-center font-travel text-sm opacity-90">
            Calculate your Mother Road adventure
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <TripCalculatorForm
            formData={formData}
            setFormData={setFormData}
            availableEndLocations={availableEndLocations}
            onCalculate={calculateTrip}
            isCalculateDisabled={isCalculateDisabled}
          />
        </CardContent>
      </Card>

      {/* Results */}
      {calculation && (
        <TripCalculatorResults calculation={calculation} />
      )}
    </div>
  );
};

export default Route66TripCalculator;
