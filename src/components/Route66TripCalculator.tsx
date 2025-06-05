
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

  // Track the trip start date from the calendar export
  const [tripStartDate, setTripStartDate] = useState<Date | null>(null);

  const handleNewTrip = () => {
    resetTrip();
    setTripStartDate(null);
  };

  const handleTripCalculated = (newTripPlan: TripPlan) => {
    // You can set a default trip start date here if needed
    // For now, we'll leave it as null and let users set it in the calendar modal
    console.log('🧮 New trip calculated:', newTripPlan);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!tripPlan ? (
        <div className="text-center space-y-6">
          <TripCalculatorForm
            formData={formData}
            setFormData={setFormData}
            onCalculate={calculateTrip}
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
            tripStartDate={tripStartDate}
          />
        </div>
      )}
    </div>
  );
};

export default Route66TripCalculator;
