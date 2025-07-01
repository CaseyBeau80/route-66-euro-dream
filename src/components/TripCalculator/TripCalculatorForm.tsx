
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Sparkles, Info } from 'lucide-react';
import { TripFormData } from './types/tripCalculator';
import { route66Towns } from '@/types/route66';
import { TripPlan } from './services/planning/TripPlanBuilder';
import FormHeader from './components/FormHeader';
import LocationSelectionForm from './components/LocationSelectionForm';
import TripDateForm from './components/TripDateForm';
import TripDurationForm from './components/TripDurationForm';
import CostEstimatorSection from './components/CostEstimatorSection';
import FormValidationHelper from './components/FormValidationHelper';
import SmartPlanningInfo from './components/SmartPlanningInfo';
import UnitSelector from './components/UnitSelector';
import StopsLimitationNotice from './components/StopsLimitationNotice';
import { useFormValidation } from './hooks/useFormValidation';
import DataSourceIndicator from './components/DataSourceIndicator';
import TripAdjustmentNotice from './components/TripAdjustmentNotice';

interface TripCalculatorFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
  onCalculate: () => void;
  availableEndLocations: typeof route66Towns;
  isCalculateDisabled: boolean;
  isCalculating: boolean;
  tripPlan?: TripPlan;
  shareUrl?: string | null;
  onTripStyleChange?: (style: 'destination-focused') => void;
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
          Plan your Route 66 heritage adventure
        </div>
        <DataSourceIndicator showDetails={true} className="text-xs" />
      </div>

      {/* Trip Adjustment Notice - Show when trip is planned and adjustments were made */}
      {tripPlan && tripPlan.originalRequestedDays && tripPlan.originalRequestedDays !== tripPlan.totalDays && (
        <TripAdjustmentNotice 
          originalDays={tripPlan.originalRequestedDays}
          actualDays={tripPlan.totalDays}
          adjustmentMessage={tripPlan.limitMessage}
          className="animate-in slide-in-from-top-2 duration-300"
        />
      )}

      {/* Stops Limitation Notice - Show after trip is planned */}
      {tripPlan && (
        <StopsLimitationNotice tripPlan={tripPlan} />
      )}

      {/* Main Form */}
      <LocationSelectionForm 
        formData={formData}
        setFormData={setFormData}
        availableEndLocations={availableEndLocations}
      />

      {/* Heritage Cities Experience Info - Fixed and Simplified */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 rounded-full p-2">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Heritage Cities Experience</h3>
            <p className="text-sm text-gray-600">Optimized for the ultimate Route 66 adventure</p>
          </div>
        </div>
        
        <div className="bg-white/70 rounded-lg p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-gray-700 leading-relaxed">
                Your trip will focus on <strong>major Route 66 heritage cities</strong> with optimized drive times 
                (<strong>maximum 10 hours per day</strong>). We prioritize iconic destinations while keeping daily drives manageable 
                for the perfect balance of adventure and comfort.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  🏛️ Heritage Cities
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  ⏱️ Max 10h/day driving
                </span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  🎯 Auto-adjusted days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Duration */}
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
      <CostEstimatorSection formData={formData} tripPlan={tripPlan} />

      {/* Form Validation Helper */}
      <FormValidationHelper 
        formData={formData}
      />

      {/* Enhanced Plan Button */}
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
          ✨ Start Your Epic Heritage Cities Journey! ✨
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Free planning • Auto-adjusted days • Heritage destinations
        </p>
      </div>

      {/* Smart Planning Info */}
      <SmartPlanningInfo />
    </div>
  );
};

export default TripCalculatorForm;
