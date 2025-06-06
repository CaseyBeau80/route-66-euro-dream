
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { TripFormData } from './types/tripCalculator';
import { route66Towns } from '@/types/route66';
import { TripPlan } from './services/planning/TripPlanBuilder';
import FormHeader from './components/FormHeader';
import LocationSelectionForm from './components/LocationSelectionForm';
import TripDateForm from './components/TripDateForm';
import TripDurationForm from './components/TripDurationForm';
import TripStyleSelector from './components/TripStyleSelector';
import CostEstimatorSection from './components/CostEstimatorSection';
import FormValidationHelper from './components/FormValidationHelper';
import SmartPlanningInfo from './components/SmartPlanningInfo';
import UnitSelector from './components/UnitSelector';
import ShareTripButton from './components/ShareTripButton';
import { useFormValidation } from './hooks/useFormValidation';

interface TripCalculatorFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
  onCalculate: () => void;
  availableEndLocations: typeof route66Towns;
  isCalculateDisabled: boolean;
  isCalculating: boolean;
  tripPlan?: TripPlan;
  shareUrl?: string | null;
}

const TripCalculatorForm: React.FC<TripCalculatorFormProps> = ({
  formData,
  setFormData,
  onCalculate,
  availableEndLocations,
  isCalculateDisabled,
  isCalculating,
  tripPlan,
  shareUrl
}) => {
  const { isFormValid } = useFormValidation(formData);

  const handleCalculateClick = () => {
    console.log('🚗 Calculate button clicked', { formData, isFormValid, isCalculateDisabled });
    
    if (!isFormValid) {
      console.log('⚠️ Form validation failed', {
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        travelDays: formData.travelDays,
        isFormValid
      });
      return;
    }

    if (isCalculating) {
      console.log('⚠️ Already calculating, ignoring click');
      return;
    }

    try {
      onCalculate();
    } catch (error) {
      console.error('❌ Error during trip calculation:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FormHeader 
        onCalculate={handleCalculateClick}
        isFormValid={isFormValid}
        isCalculating={isCalculating}
      />

      {/* Main Form */}
      <LocationSelectionForm 
        formData={formData}
        setFormData={setFormData}
        availableEndLocations={availableEndLocations}
      />

      {/* Trip Style Selector - NEW */}
      <TripStyleSelector 
        formData={formData}
        setFormData={setFormData}
      />

      {/* Trip Duration - moved above Trip Start Date */}
      <TripDurationForm 
        formData={formData}
        setFormData={setFormData}
      />

      {/* Trip Start Date */}
      <TripDateForm 
        formData={formData}
        setFormData={setFormData}
      />

      {/* Unit Selector */}
      <div className="p-4 bg-route66-background-alt rounded-lg border border-route66-border">
        <UnitSelector />
      </div>

      {/* Cost Estimator Section - Pass tripPlan for real data */}
      <CostEstimatorSection formData={formData} tripPlan={tripPlan} />

      {/* Form Validation Helper - moved above Plan button */}
      <FormValidationHelper 
        formData={formData}
        isFormValid={isFormValid}
      />

      {/* Plan Button */}
      <Button
        onClick={handleCalculateClick}
        disabled={!isFormValid || isCalculating}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <MapPin className="h-5 w-5" />
        {isCalculating ? 'Planning Your Route 66 Trip...' : 'Plan My Route 66 Trip'}
      </Button>

      {/* Share Trip Button - centered and only show if form is valid */}
      {isFormValid && (
        <div className="flex justify-center mt-4">
          <ShareTripButton
            tripPlan={tripPlan}
            shareUrl={shareUrl}
            tripStartDate={formData.tripStartDate}
            variant="secondary"
            size="default"
          />
        </div>
      )}

      {/* Smart Planning Info */}
      <SmartPlanningInfo />
    </div>
  );
};

export default TripCalculatorForm;
