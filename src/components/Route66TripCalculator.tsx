
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TripCalculatorForm from './TripCalculator/TripCalculatorForm';
import EnhancedTripResults from './TripCalculator/EnhancedTripResults';
import { useTripCalculation } from './TripCalculator/hooks/useTripCalculation';
import { TripPlan } from './TripCalculator/services/planning/TripPlanBuilder';

const Route66TripCalculator: React.FC = () => {
  const {
    startCity,
    setStartCity,
    endCity,
    setEndCity,
    days,
    setDays,
    tripPlan,
    isLoading,
    error,
    shareUrl,
    calculateTrip,
    resetForm
  } = useTripCalculation();

  // Track the trip start date from the calendar export
  const [tripStartDate, setTripStartDate] = useState<Date | null>(null);

  const handleNewTrip = () => {
    resetForm();
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
            startCity={startCity}
            setStartCity={setStartCity}
            endCity={endCity}
            setEndCity={setEndCity}
            days={days}
            setDays={setDays}
            onCalculate={calculateTrip}
            isLoading={isLoading}
            error={error}
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
