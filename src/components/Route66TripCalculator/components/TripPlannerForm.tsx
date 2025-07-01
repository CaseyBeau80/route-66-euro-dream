
import React, { useState } from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import CostEstimatorSection from '../../TripCalculator/components/CostEstimatorSection';
import FormValidationHelper from '../../TripCalculator/components/FormValidationHelper';
import { useFormValidation } from '../../TripCalculator/hooks/useFormValidation';
import LocationSelectionSection from './LocationSelectionSection';
import TripDetailsSection from './TripDetailsSection';
import ActionButtonsSection from './ActionButtonsSection';
import InlineDayAdjustmentNotice from './InlineDayAdjustmentNotice';

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
  const { dayAdjustmentInfo, isFormValid } = useFormValidation(formData);
  const [hasAcknowledgedAdjustment, setHasAcknowledgedAdjustment] = useState(false);

  console.log('📝 TripPlannerForm render (SIMPLE APPROACH):', {
    formData,
    isPlanning,
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    hasAcknowledgedAdjustment,
    canPlan: isFormValid && (!dayAdjustmentInfo || hasAcknowledgedAdjustment)
  });

  const handlePlanTrip = async () => {
    console.log('🚀 TripPlannerForm: Plan trip button clicked (SIMPLE APPROACH)');
    
    // If day adjustment is needed but not acknowledged, do nothing
    if (dayAdjustmentInfo && !hasAcknowledgedAdjustment) {
      console.log('⚠️ Day adjustment needed but not acknowledged - blocking planning');
      return;
    }

    try {
      // Use adjusted data if there was an adjustment
      const dataToUse = dayAdjustmentInfo ? {
        ...formData,
        travelDays: dayAdjustmentInfo.minimum
      } : formData;

      await onPlanTrip(dataToUse);
    } catch (error) {
      console.error('❌ TripPlannerForm: Planning failed:', error);
    }
  };

  const handleAcknowledgeAdjustment = () => {
    console.log('✅ User acknowledged day adjustment (SIMPLE APPROACH)');
    setHasAcknowledgedAdjustment(true);
  };

  const canProceedWithPlanning = isFormValid && (!dayAdjustmentInfo || hasAcknowledgedAdjustment);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Unified Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-route66-primary mb-2">Trip Planner Tool</h2>
      </div>

      {/* Form Validation Helper - Only show for basic validation, not day adjustments */}
      {!dayAdjustmentInfo && (
        <FormValidationHelper formData={formData} className="mb-4" />
      )}

      {/* Day Adjustment Notice - Show inline when needed */}
      {dayAdjustmentInfo && (
        <InlineDayAdjustmentNotice
          formData={formData}
          onAcknowledge={handleAcknowledgeAdjustment}
          isAcknowledged={hasAcknowledgedAdjustment}
          className="mb-6"
        />
      )}

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
            isFormValid={canProceedWithPlanning} 
            isPlanning={isPlanning} 
            onPlanTrip={handlePlanTrip} 
            onResetTrip={onResetTrip}
            needsAdjustmentAcknowledgment={dayAdjustmentInfo && !hasAcknowledgedAdjustment}
          />
        </div>

      </div>
    </div>
  );
};

export default TripPlannerForm;
