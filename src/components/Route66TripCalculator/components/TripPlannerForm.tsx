
import React from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import CostEstimatorSection from '../../TripCalculator/components/CostEstimatorSection';
import LocationSelectionSection from './LocationSelectionSection';
import TripDetailsSection from './TripDetailsSection';
import TripStyleSection from './TripStyleSection';
import ActionButtonsSection from './ActionButtonsSection';

interface TripPlannerFormProps {
  formData: TripFormData;
  onStartDateChange: (date: Date | undefined) => void;
  onLocationChange: (type: 'start' | 'end', location: string) => void;
  onTravelDaysChange: (days: number) => void;
  onTripStyleChange: (style: 'balanced' | 'destination-focused') => void;
  onPlanTrip: () => void;
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
  console.log('📝 TripPlannerForm render:', { formData, isPlanning });

  const isFormValid = formData.startLocation && formData.endLocation && formData.travelDays > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-route66-primary mb-2">
          Plan Your Route 66 Adventure
        </h2>
        <p className="text-route66-text-secondary">
          Choose your start and end points, and let us create your perfect itinerary
        </p>
      </div>

      {/* Location Selection */}
      <LocationSelectionSection
        startLocation={formData.startLocation}
        endLocation={formData.endLocation}
        onLocationChange={onLocationChange}
      />

      {/* Trip Details */}
      <TripDetailsSection
        tripStartDate={formData.tripStartDate}
        travelDays={formData.travelDays}
        onStartDateChange={onStartDateChange}
        onTravelDaysChange={onTravelDaysChange}
      />

      {/* Trip Style */}
      <TripStyleSection
        tripStyle={formData.tripStyle}
        onTripStyleChange={onTripStyleChange}
      />

      {/* Cost Estimator Section */}
      <div className="bg-white rounded-xl shadow-lg border border-route66-tan p-6">
        <CostEstimatorSection formData={formData} tripPlan={tripPlan} />
      </div>

      {/* Action Buttons */}
      <ActionButtonsSection
        isFormValid={isFormValid}
        isPlanning={isPlanning}
        onPlanTrip={onPlanTrip}
        onResetTrip={onResetTrip}
      />
    </div>
  );
};

export default TripPlannerForm;
