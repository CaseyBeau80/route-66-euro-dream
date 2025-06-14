
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, Gauge } from 'lucide-react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import { route66Towns } from '@/types/route66';

interface TripPlannerFormProps {
  formData: TripFormData;
  onStartDateChange: (date: Date | undefined) => void;
  onLocationChange: (type: 'start' | 'end', location: string) => void;
  onTravelDaysChange: (days: number) => void;
  onTripStyleChange: (style: 'balanced' | 'destination-focused') => void;
  onPlanTrip: () => void;
  onResetTrip: () => void;
  isPlanning: boolean;
}

const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  formData,
  onStartDateChange,
  onLocationChange,
  onTravelDaysChange,
  onTripStyleChange,
  onPlanTrip,
  onResetTrip,
  isPlanning
}) => {
  console.log('📝 TripPlannerForm render:', { formData, isPlanning });

  // Get available end locations (excluding start location)
  const availableEndLocations = route66Towns.filter(
    town => town.name !== formData.startLocation
  );

  const handleStartLocationChange = (value: string) => {
    onLocationChange('start', value);
  };

  const handleEndLocationChange = (value: string) => {
    onLocationChange('end', value);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-route66-text-primary">
            <MapPin className="inline w-4 h-4 mr-1" />
            Start Location
          </label>
          <select
            value={formData.startLocation}
            onChange={(e) => handleStartLocationChange(e.target.value)}
            className="w-full p-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent"
          >
            <option value="">Choose starting point</option>
            {route66Towns.map((town) => (
              <option key={town.name} value={town.name}>
                {town.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-route66-text-primary">
            <MapPin className="inline w-4 h-4 mr-1" />
            End Location
          </label>
          <select
            value={formData.endLocation}
            onChange={(e) => handleEndLocationChange(e.target.value)}
            disabled={!formData.startLocation}
            className="w-full p-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Choose destination</option>
            {availableEndLocations.map((town) => (
              <option key={town.name} value={town.name}>
                {town.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trip Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-route66-text-primary">
            <Calendar className="inline w-4 h-4 mr-1" />
            Trip Start Date
          </label>
          <input
            type="date"
            value={formData.tripStartDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => onStartDateChange(e.target.value ? new Date(e.target.value) : undefined)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-route66-text-primary">
            <Users className="inline w-4 h-4 mr-1" />
            Travel Days
          </label>
          <input
            type="number"
            value={formData.travelDays}
            onChange={(e) => onTravelDaysChange(parseInt(e.target.value) || 0)}
            min="1"
            max="30"
            className="w-full p-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Trip Style */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-route66-text-primary">
          <Gauge className="inline w-4 h-4 mr-1" />
          Trip Style
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onTripStyleChange('balanced')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              formData.tripStyle === 'balanced'
                ? 'border-route66-primary bg-route66-primary/10 text-route66-primary'
                : 'border-route66-border hover:border-route66-primary/50'
            }`}
          >
            <div className="font-medium">Balanced Experience</div>
            <div className="text-sm text-route66-text-secondary mt-1">
              Perfect mix of driving and sightseeing
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => onTripStyleChange('destination-focused')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              formData.tripStyle === 'destination-focused'
                ? 'border-route66-primary bg-route66-primary/10 text-route66-primary'
                : 'border-route66-border hover:border-route66-primary/50'
            }`}
          >
            <div className="font-medium">Destination Focused</div>
            <div className="text-sm text-route66-text-secondary mt-1">
              Prioritizes major heritage cities
            </div>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onPlanTrip}
          disabled={!isFormValid || isPlanning}
          className="flex-1 bg-route66-primary hover:bg-route66-primary/90 text-white py-3"
        >
          {isPlanning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Planning Your Adventure...
            </>
          ) : (
            'Plan My Route 66 Trip'
          )}
        </Button>
        
        <Button
          onClick={onResetTrip}
          variant="outline"
          className="px-6"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default TripPlannerForm;
