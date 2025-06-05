
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TripCalculatorForm from './TripCalculator/TripCalculatorForm';
import EnhancedTripResults from './TripCalculator/EnhancedTripResults';
import { useEnhancedTripCalculation } from './TripCalculator/hooks/useEnhancedTripCalculation';
import { TripPlan } from './TripCalculator/services/planning/TripPlanBuilder';

const Route66TripCalculator: React.FC = () => {
  const {
    formData,
    setFormData,
    tripPlan,
    shareUrl,
    availableEndLocations,
    calculateTrip,
    resetTrip,
    isCalculating,
    isCalculateDisabled
  } = useEnhancedTripCalculation();

  const handleNewTrip = () => {
    console.log('🔄 Starting new trip calculation');
    resetTrip();
  };

  const handleTripCalculated = (newTripPlan: TripPlan) => {
    console.log('🧮 New trip calculated:', newTripPlan);
  };

  const handleCalculateTrip = async () => {
    console.log('🚗 Calculate trip handler called', { formData });
    
    try {
      await calculateTrip();
      console.log('✅ Trip calculation completed successfully');
    } catch (error) {
      console.error('❌ Trip calculation failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!tripPlan ? (
        <div className="text-center space-y-6">
          <TripCalculatorForm
            formData={formData}
            setFormData={setFormData}
            onCalculate={handleCalculateTrip}
            availableEndLocations={availableEndLocations}
            isCalculateDisabled={isCalculateDisabled}
            isCalculating={isCalculating}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Plan Another Trip Button */}
          <div className="text-center">
            <Button
              onClick={handleNewTrip}
              variant="outline"
              className="border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white"
            >
              Plan Another Trip
            </Button>
          </div>

          {/* Trip Results with Start Date */}
          <EnhancedTripResults 
            tripPlan={tripPlan} 
            shareUrl={shareUrl} 
            tripStartDate={formData.tripStartDate}
          />
        </div>
      )}
    </div>
  );
};

export default Route66TripCalculator;
