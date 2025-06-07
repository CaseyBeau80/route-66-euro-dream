
import React, { useState } from 'react';
import { TripService } from '../TripCalculator/services/TripService';
import { TripPlan } from '../TripCalculator/services/planning/TripPlanBuilder';
import TripCalculatorForm from '../TripCalculator/TripCalculatorForm';
import EnhancedTripResults from '../TripCalculator/EnhancedTripResults';
import TripStyleIndicator from './components/TripStyleIndicator';
import { useFormData } from './hooks/useFormData';
import { useTripCalculation } from './hooks/useTripCalculation';
import { toast } from '@/hooks/use-toast';

const Route66TripCalculator: React.FC = () => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  
  const {
    formData,
    setFormData,
    getAvailableEndLocations,
    isCalculateDisabled
  } = useFormData();

  const {
    tripPlan,
    isCalculating,
    planningResult,
    calculateTrip,
    resetTrip
  } = useTripCalculation();

  const handleShareTrip = async (tripPlan: TripPlan) => {
    try {
      const shareCode = await TripService.saveTrip(tripPlan);
      if (shareCode) {
        const newShareUrl = TripService.getShareUrl(shareCode);
        setShareUrl(newShareUrl);
        toast({
          title: "Trip Saved & Shared!",
          description: "Your Route 66 trip has been saved and a shareable link has been generated.",
        });
      } else {
        toast({
          title: "Failed to Share",
          description: "Could not save trip. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sharing trip:', error);
      toast({
        title: "Sharing Error",
        description: "An error occurred while sharing the trip.",
        variant: "destructive"
      });
    }
  };

  const handleCalculateTrip = async () => {
    setShareUrl(null);
    await calculateTrip(formData);
  };

  const availableEndLocations = getAvailableEndLocations();

  return (
    <div className="space-y-8">
      {/* Trip Calculator Form */}
      <TripCalculatorForm
        formData={formData}
        setFormData={setFormData}
        onCalculate={handleCalculateTrip}
        availableEndLocations={availableEndLocations}
        isCalculateDisabled={isCalculateDisabled}
        isCalculating={isCalculating}
        tripPlan={tripPlan}
        shareUrl={shareUrl}
      />

      {/* Trip Results */}
      {tripPlan && (
        <div className="mt-8">
          {/* Enhanced Trip Style Indicator */}
          {planningResult && (
            <TripStyleIndicator planningResult={planningResult} />
          )}

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
