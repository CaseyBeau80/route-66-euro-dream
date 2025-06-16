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
  console.log('📝 TripPlannerForm render:', {
    formData,
    isPlanning
  });
  const isFormValid = formData.startLocation && formData.endLocation && formData.travelDays > 0;
  return <div className="max-w-4xl mx-auto">
      {/* Unified Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-route66-primary mb-3">Trip Planner Tool</h2>
        
      </div>

      {/* Main Form Container - Unified styling */}
      <div className="space-y-6">
        
        {/* Location Selection Card */}
        <div className="bg-white rounded-xl shadow-sm border border-route66-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-route66-text-primary">Route Selection</h3>
          </div>
          <LocationSelectionSection startLocation={formData.startLocation} endLocation={formData.endLocation} onLocationChange={onLocationChange} />
        </div>

        {/* Trip Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-route66-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-route66-text-primary">Trip Details</h3>
          </div>
          <TripDetailsSection tripStartDate={formData.tripStartDate} travelDays={formData.travelDays} onStartDateChange={onStartDateChange} onTravelDaysChange={onTravelDaysChange} />
        </div>

        {/* Trip Style Card */}
        <div className="bg-white rounded-xl shadow-sm border border-route66-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-route66-text-primary">Trip Style</h3>
          </div>
          <TripStyleSection tripStyle={formData.tripStyle} onTripStyleChange={onTripStyleChange} />
        </div>

        {/* Cost Estimator Card - Unified with other cards */}
        <div className="bg-white rounded-xl shadow-sm border border-route66-border overflow-hidden">
          <div className="flex items-center gap-2 p-6 pb-0">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-route66-text-primary">Budget Planning</h3>
          </div>
          <div className="p-6 pt-4">
            <CostEstimatorSection formData={formData} tripPlan={tripPlan} />
          </div>
        </div>

        {/* Action Buttons Card */}
        <div className="bg-white rounded-xl shadow-sm border border-route66-border p-6">
          <ActionButtonsSection isFormValid={isFormValid} isPlanning={isPlanning} onPlanTrip={onPlanTrip} onResetTrip={onResetTrip} />
        </div>

      </div>
    </div>;
};
export default TripPlannerForm;