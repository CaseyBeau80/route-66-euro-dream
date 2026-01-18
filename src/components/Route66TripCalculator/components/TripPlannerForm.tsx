
import React from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import CostEstimatorSection from '../../TripCalculator/components/CostEstimatorSection';
import FormValidationHelper from '../../TripCalculator/components/FormValidationHelper';
import { useBlockingDayValidation } from '../../TripCalculator/hooks/useBlockingDayValidation';
import LocationSelectionSection from './LocationSelectionSection';
import TripDetailsSection from './TripDetailsSection';
import ActionButtonsSection from './ActionButtonsSection';

interface TripPlannerFormProps {
  formData: TripFormData;
  onStartDateChange: (date: Date | undefined) => void;
  onLocationChange: (type: 'start' | 'end', location: string) => void;
  onTravelDaysChange: (days: number) => void;
  onTripStyleChange: (style: 'balanced' | 'destination-focused') => void;
  onPlanTrip: (data: TripFormData) => Promise<void>;
  onResetTrip: () => void;
  isPlanning: boolean;
  tripPlan?: any;
}

const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  formData,
  onStartDateChange,
  onLocationChange,
  onTravelDaysChange,
  onTripStyleChange,
  onPlanTrip,
  onResetTrip,
  isPlanning,
  tripPlan
}) => {
  const { 
    dayAdjustmentInfo, 
    isFormValid, 
    canProceedWithPlanning, 
    isBlocked,
    checkAndConfirmAdjustment,
    resetConfirmation
  } = useBlockingDayValidation(formData);

  console.log('📝 TripPlannerForm render (NO BLOCKING):', {
    formData,
    isPlanning,
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    canProceedWithPlanning,
    isBlocked,
    isFormValid
  });

  const handlePlanTrip = async () => {
    console.log('🚀 TripPlannerForm: Plan trip button clicked (NO BLOCKING)');
    
    try {
      // Use adjusted data if there was an adjustment, otherwise use original data
      const dataToUse = dayAdjustmentInfo ? {
        ...formData,
        travelDays: dayAdjustmentInfo.minimum
      } : formData;

      // Track GA4 event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'plan_trip_submitted', {
          start_location: dataToUse.startLocation,
          end_location: dataToUse.endLocation,
          travel_days: dataToUse.travelDays
        });
      }

      console.log('🚀 Proceeding with planning (no confirmation needed):', dataToUse);
      await onPlanTrip(dataToUse);
    } catch (error) {
      console.error('❌ TripPlannerForm: Planning failed:', error);
    }
  };

  // Reset confirmation when locations change
  React.useEffect(() => {
    resetConfirmation();
  }, [formData.startLocation, formData.endLocation, formData.travelDays, resetConfirmation]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Unified Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-route66-primary mb-2">Trip Planner Tool</h2>
      </div>

      {/* Form Validation Helper - Show validation issues */}
      <FormValidationHelper formData={formData} className="mb-4" />

      {/* Main Form Container */}
      <div className="space-y-4">
        
        {/* Location Selection Card */}
        <div className="bg-white rounded-xl shadow-sm border border-route66-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-route66-text-primary">Route Selection</h3>
          </div>
          <LocationSelectionSection 
            startLocation={formData.startLocation} 
            endLocation={formData.endLocation} 
            onLocationChange={onLocationChange} 
          />
        </div>

        {/* Trip Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-route66-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-route66-text-primary">Trip Details</h3>
          </div>
          
          <TripDetailsSection 
            tripStartDate={formData.tripStartDate} 
            travelDays={formData.travelDays} 
            onStartDateChange={onStartDateChange} 
            onTravelDaysChange={onTravelDaysChange}
            formData={formData}
          />
        </div>

        {/* Cost Estimator Card */}
        <div className="bg-white rounded-xl shadow-sm border border-route66-border overflow-hidden">
          <div className="flex items-center gap-2 p-4 pb-0">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-route66-text-primary">Budget Planning</h3>
          </div>
          <div className="p-4 pt-2">
            <CostEstimatorSection formData={formData} tripPlan={tripPlan} />
          </div>
        </div>

        {/* Action Buttons Card */}
        <div className="bg-white rounded-xl shadow-sm border border-route66-border p-4">
          <ActionButtonsSection 
            isFormValid={isFormValid} 
            isPlanning={isPlanning} 
            onPlanTrip={handlePlanTrip} 
            onResetTrip={onResetTrip}
            needsAdjustmentAcknowledgment={false}
          />
        </div>

      </div>
    </div>
  );
};

export default TripPlannerForm;
