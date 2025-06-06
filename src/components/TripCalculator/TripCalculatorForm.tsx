
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { TripFormData } from './types/tripCalculator';
import { route66Towns } from '@/types/route66';
import FormHeader from './components/FormHeader';
import LocationSelectionForm from './components/LocationSelectionForm';
import TripDateForm from './components/TripDateForm';
import TripDurationForm from './components/TripDurationForm';
import CostEstimatorSection from './components/CostEstimatorSection';
import FormValidationHelper from './components/FormValidationHelper';
import SmartPlanningInfo from './components/SmartPlanningInfo';
import UnitSelector from './components/UnitSelector';
import { useFormValidation } from './hooks/useFormValidation';

interface TripCalculatorFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
  onCalculate: () => void;
  availableEndLocations: typeof route66Towns;
  isCalculateDisabled: boolean;
  isCalculating: boolean;
}

const TripCalculatorForm: React.FC<TripCalculatorFormProps> = ({
  formData,
  setFormData,
  onCalculate,
  availableEndLocations,
  isCalculateDisabled,
  isCalculating
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

      {/* Cost Estimator Section */}
      <CostEstimatorSection formData={formData} />

      {/* Plan Button */}
      <Button
        onClick={handleCalculateClick}
        disabled={!isFormValid || isCalculating}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <MapPin className="h-5 w-5" />
        {isCalculating ? 'Planning Your Route 66 Trip...' : 'Plan My Route 66 Trip'}
      </Button>

      {/* Form Validation Helper */}
      <FormValidationHelper 
        formData={formData}
        isFormValid={isFormValid}
      />

      {/* Smart Planning Info */}
      <SmartPlanningInfo />
    </div>
  );
};

export default TripCalculatorForm;
