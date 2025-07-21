
import React, { useState } from 'react';
import { PlannerFormData, TripItinerary } from './types';
import { usePlannerService } from './hooks/usePlannerService';
import { GoogleDistanceMatrixService } from './services/GoogleDistanceMatrixService';
import PlannerFormHeader from './components/PlannerFormHeader';
import ApiKeySection from './components/ApiKeySection';
import DateAndLocationSection from './components/DateAndLocationSection';
import PlanningTypeSection from './components/PlanningTypeSection';
import PlanningDetailsSection from './components/PlanningDetailsSection';
import PlanButtonSection from './components/PlanButtonSection';

interface Route66PlannerFormProps {
  formData: PlannerFormData;
  setFormData: (data: PlannerFormData) => void;
  onPlan: (itinerary: TripItinerary) => void;
  isPlanning: boolean;
  setIsPlanning: (planning: boolean) => void;
}

const Route66PlannerForm: React.FC<Route66PlannerFormProps> = ({
  formData,
  setFormData,
  onPlan,
  isPlanning,
  setIsPlanning
}) => {
  const { planTrip } = usePlannerService();
  const [showApiKeyInput, setShowApiKeyInput] = useState(!GoogleDistanceMatrixService.isAvailable());

  const handlePlanTrip = async () => {
    if (!formData.startDate || !formData.startCity || !formData.endCity) {
      return;
    }

    setIsPlanning(true);
    try {
      const itinerary = await planTrip(formData);
      onPlan(itinerary);
    } catch (error) {
      console.error('Planning error:', error);
    } finally {
      setIsPlanning(false);
    }
  };

  const isFormValid = Boolean(formData.startDate && formData.startCity && formData.endCity);

  return (
    <div className="space-y-6">
      <PlannerFormHeader />
      
      <ApiKeySection 
        showApiKeyInput={showApiKeyInput}
        onApiKeySet={() => setShowApiKeyInput(false)}
      />

      <DateAndLocationSection 
        formData={formData}
        setFormData={setFormData}
      />

      <PlanningTypeSection 
        formData={formData}
        setFormData={setFormData}
      />

      <PlanningDetailsSection 
        formData={formData}
        setFormData={setFormData}
      />

      <PlanButtonSection 
        onPlanTrip={handlePlanTrip}
        isFormValid={isFormValid}
        isPlanning={isPlanning}
      />
    </div>
  );
};

export default Route66PlannerForm;
