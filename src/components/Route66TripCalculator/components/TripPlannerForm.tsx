
import React from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import CostEstimatorSection from '../../TripCalculator/components/CostEstimatorSection';
import FormValidationHelper from '../../TripCalculator/components/FormValidationHelper';
import TwoPhasePlanningModal from '../../TripCalculator/components/TwoPhasePlanningModal';
import { useTwoPhasePlanning } from '../../TripCalculator/hooks/useTwoPhasePlanning';
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
  const { dayAdjustmentInfo } = useFormValidation(formData);
  const { 
    planningState, 
    startPlanning, 
    acknowledgeAdjustment, 
    proceedWithPlanning,
    resetPlanning,
    canProceedWithPlanning 
  } = useTwoPhasePlanning(formData);

  console.log('📝 TripPlannerForm render:', {
    formData,
    isPlanning,
    planningPhase: planningState.phase,
    needsAdjustment: !!dayAdjustmentInfo,
    showModal: planningState.showModal,
    adjustmentAcknowledged: planningState.adjustmentAcknowledged
  });

  const handlePlanTrip = async () => {
    console.log('🚀 TripPlannerForm: Plan trip button clicked');
    
    try {
      await startPlanning(onPlanTrip);
    } catch (error) {
      console.error('❌ TripPlannerForm: Planning failed:', error);
      resetPlanning();
    }
  };

  const handleAcknowledgeAdjustment = async () => {
    console.log('✅ TripPlannerForm: User acknowledged adjustment');
    
    // Acknowledge the adjustment first
    acknowledgeAdjustment();
    
    // Small delay to ensure state update, then proceed with planning using the new function
    setTimeout(async () => {
      console.log('🎯 TripPlannerForm: Proceeding with planning after acknowledgment');
      try {
        await proceedWithPlanning(onPlanTrip);
      } catch (error) {
        console.error('❌ TripPlannerForm: Planning after adjustment failed:', error);
        resetPlanning();
      }
    }, 100);
  };

  const handleCancelAdjustment = () => {
    console.log('❌ TripPlannerForm: User cancelled adjustment');
    resetPlanning();
  };

  const isFormValid = formData.startLocation && formData.endLocation && formData.travelDays > 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Unified Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-route66-primary mb-2">Trip Planner Tool</h2>
      </div>

      {/* Two-Phase Planning Modal - Show based on showModal flag */}
      {planningState.showModal && dayAdjustmentInfo && planningState.adjustedFormData && (
        <TwoPhasePlanningModal
          isOpen={true}
          dayAdjustmentInfo={dayAdjustmentInfo}
          formData={planningState.adjustedFormData}
          onAcknowledge={handleAcknowledgeAdjustment}
          onCancel={handleCancelAdjustment}
        />
      )}

      {/* Form Validation Helper - Only show for basic validation, not day adjustments */}
      {!dayAdjustmentInfo && (
        <FormValidationHelper formData={formData} className="mb-4" />
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
          
          {/* Inline Day Adjustment Notice - Only show when not in modal mode */}
          {dayAdjustmentInfo && !planningState.showModal && (
            <InlineDayAdjustmentNotice formData={formData} className="mb-4" />
          )}
          
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
            isPlanning={isPlanning || planningState.isProcessing} 
            onPlanTrip={handlePlanTrip} 
            onResetTrip={onResetTrip} 
          />
        </div>

      </div>
    </div>
  );
};

export default TripPlannerForm;
