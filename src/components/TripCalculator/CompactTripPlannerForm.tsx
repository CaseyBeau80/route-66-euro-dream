
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Sparkles, Calendar, Clock, DollarSign } from 'lucide-react';
import { TripFormData } from './types/tripCalculator';
import { route66Towns } from '@/types/route66';
import { TripPlan } from './services/planning/TripPlanBuilder';
import { useFormValidation } from './hooks/useFormValidation';

interface CompactTripPlannerFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
  onCalculate: () => void;
  availableEndLocations: typeof route66Towns;
  isCalculateDisabled: boolean;
  isCalculating: boolean;
  tripPlan?: TripPlan;
}

const CompactTripPlannerForm: React.FC<CompactTripPlannerFormProps> = ({
  formData,
  setFormData,
  onCalculate,
  availableEndLocations,
  isCalculateDisabled,
  isCalculating,
  tripPlan
}) => {
  const { isFormValid } = useFormValidation(formData);

  const handleCalculateClick = () => {
    console.log('🚗 Plan button clicked', { formData, isFormValid, isCalculateDisabled });
    
    if (!isFormValid || isCalculating) {
      return;
    }

    try {
      onCalculate();
    } catch (error) {
      console.error('❌ Error during trip calculation:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Location Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-route66-primary flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Route Selection
        </h3>
        
        {/* Start Location */}
        <div>
          <label htmlFor="startLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Starting City
          </label>
          <select
            id="startLocation"
            value={formData.startLocation}
            onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent text-sm"
          >
            <option value="">Select starting city</option>
            <option value="Chicago, IL">Chicago, IL</option>
            <option value="Santa Monica, CA">Santa Monica, CA</option>
          </select>
        </div>

        {/* End Location */}
        <div>
          <label htmlFor="endLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Destination City
          </label>
          <select
            id="endLocation"
            value={formData.endLocation}
            onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent text-sm"
          >
            <option value="">Select destination city</option>
            {availableEndLocations.map((location) => (
              <option key={location.name} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trip Duration */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-route66-primary flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Duration
        </h3>
        
        <div>
          <label htmlFor="travelDays" className="block text-sm font-medium text-gray-700 mb-1">
            Travel Days
          </label>
          <select
            id="travelDays"
            value={formData.travelDays}
            onChange={(e) => setFormData({ ...formData, travelDays: parseInt(e.target.value) || 0 })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent text-sm"
          >
            <option value={0}>Select duration</option>
            {Array.from({ length: 14 }, (_, i) => i + 1).map((days) => (
              <option key={days} value={days}>
                {days} {days === 1 ? 'day' : 'days'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trip Start Date */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-route66-primary flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Start Date
        </h3>
        
        <div>
          <input
            type="date"
            value={formData.tripStartDate ? formData.tripStartDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              tripStartDate: e.target.value ? new Date(e.target.value) : new Date() 
            })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent text-sm"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Cost Estimate Preview */}
      {tripPlan && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-800 flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4" />
            Estimated Cost
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-white rounded border">
              <div className="font-semibold text-green-700">$1,200 - $2,400</div>
              <div className="text-gray-600">Total Budget</div>
            </div>
            <div className="text-center p-2 bg-white rounded border">
              <div className="font-semibold text-blue-700">${Math.round(tripPlan.totalDistance * 0.15)} - ${Math.round(tripPlan.totalDistance * 0.25)}</div>
              <div className="text-gray-600">Fuel Cost</div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Button */}
      <div className="pt-2">
        <Button
          onClick={handleCalculateClick}
          disabled={!isFormValid || isCalculating}
          className="w-full bg-gradient-to-r from-route66-primary to-route66-secondary hover:from-route66-secondary hover:to-route66-primary text-white py-3 text-base font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Planning...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Plan My Adventure</span>
            </>
          )}
        </Button>
        
        {!isFormValid && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Please fill in all required fields to plan your trip
          </p>
        )}
      </div>

      {/* Trip Results Summary */}
      {tripPlan && (
        <div className="bg-white border-2 border-route66-border rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-route66-primary mb-3">
            Trip Summary
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center p-2 bg-route66-cream rounded">
              <div className="font-semibold text-route66-vintage-red">{Math.round(tripPlan.totalDistance)} miles</div>
              <div className="text-route66-vintage-brown">Total Distance</div>
            </div>
            <div className="text-center p-2 bg-route66-cream rounded">
              <div className="font-semibold text-route66-vintage-red">{tripPlan.totalDays} days</div>
              <div className="text-route66-vintage-brown">Duration</div>
            </div>
            <div className="text-center p-2 bg-route66-cream rounded">
              <div className="font-semibold text-route66-vintage-red">{tripPlan.segments.length}</div>
              <div className="text-route66-vintage-brown">Segments</div>
            </div>
            <div className="text-center p-2 bg-route66-cream rounded">
              <div className="font-semibold text-route66-vintage-red">{Math.round(tripPlan.totalDrivingTime)}h</div>
              <div className="text-route66-vintage-brown">Drive Time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactTripPlannerForm;
