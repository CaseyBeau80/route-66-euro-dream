
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Sparkles } from 'lucide-react';
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
import { useFormValidation } from './hooks/useFormValidation';
import DataSourceIndicator from './components/DataSourceIndicator';

interface TripCalculatorFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
  onCalculate: () => void;
  availableEndLocations: typeof route66Towns;
  isCalculateDisabled: boolean;
  isCalculating: boolean;
  tripPlan?: TripPlan;
  shareUrl?: string | null;
  onTripStyleChange?: (style: 'balanced' | 'destination-focused') => void;
}

const TripCalculatorForm: React.FC<TripCalculatorFormProps> = ({
  formData,
  setFormData,
  onCalculate,
  availableEndLocations,
  isCalculateDisabled,
  isCalculating,
  tripPlan,
  shareUrl,
  onTripStyleChange
}) => {
  const { isFormValid } = useFormValidation(formData);

  const handleCalculateClick = () => {
    console.log('🚗 Plan button clicked', { formData, isFormValid, isCalculateDisabled });
    
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

  const handleTripStyleChange = (style: 'balanced' | 'destination-focused') => {
    console.log(`🎨 Trip style changed to: ${style}, triggering re-plan if trip exists`);
    
    // If we have a valid trip plan and the style actually changed, trigger re-planning
    if (tripPlan && formData.tripStyle !== style && isFormValid) {
      console.log(`🔄 Trip style changed from ${formData.tripStyle} to ${style}, re-planning...`);
      
      // Update form data first
      setFormData({
        ...formData,
        tripStyle: style
      });
      
      // Call external handler if provided
      if (onTripStyleChange) {
        onTripStyleChange(style);
      }
      
      // Trigger recalculation after a short delay to ensure state update
      setTimeout(() => {
        onCalculate();
      }, 100);
    } else {
      // Just update form data if no trip exists yet
      setFormData({
        ...formData,
        tripStyle: style
      });
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

      {/* Data Source Status Indicator */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Plan your Route 66 adventure
        </div>
        <DataSourceIndicator showDetails={true} className="text-xs" />
      </div>

      {/* Main Form */}
      <LocationSelectionForm 
        formData={formData}
        setFormData={setFormData}
        availableEndLocations={availableEndLocations}
      />

      {/* Trip Style Selector with change handler */}
      <TripStyleSelector 
        formData={formData}
        setFormData={setFormData}
        onTripStyleChange={handleTripStyleChange}
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

      {/* Enhanced Plan Button - Maximum Attention */}
      <div className="relative">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-xl opacity-20 animate-pulse blur-lg"></div>
        
        {/* Main button container */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-1 rounded-xl shadow-2xl">
          <Button
            onClick={handleCalculateClick}
            disabled={!isFormValid || isCalculating}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white py-6 text-xl font-bold rounded-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                <span className="animate-pulse">Planning Your Route 66 Adventure...</span>
                <Sparkles className="h-6 w-6 animate-pulse" />
              </>
            ) : (
              <>
                <MapPin className="h-6 w-6 animate-bounce" />
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-black tracking-wide">
                  Plan My Route 66 Adventure
                </span>
                <Sparkles className="h-6 w-6 animate-pulse text-yellow-300" />
              </>
            )}
          </Button>
        </div>
        
        {/* Floating sparkle effects */}
        {!isCalculating && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        )}
        {!isCalculating && (
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
        )}
      </div>

      {/* Call-to-action text below button */}
      <div className="text-center">
        <p className="text-lg font-semibold text-blue-700 animate-pulse">
          ✨ Start Your Epic Journey on America's Most Famous Highway! ✨
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Free planning • Instant results • Customizable itinerary
        </p>
      </div>

      {/* Smart Planning Info */}
      <SmartPlanningInfo />
    </div>
  );
};

export default TripCalculatorForm;
