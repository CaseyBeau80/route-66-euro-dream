
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Calendar, MapPin } from 'lucide-react';
import DestinationCitySelector from './DestinationCitySelector';
import { PlannerFormData, TripItinerary } from './types';
import { usePlannerService } from './hooks/usePlannerService';

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

  const isFormValid = formData.startDate && formData.startCity && formData.endCity;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[#3b82f6] font-semibold">
        <Calendar className="w-5 h-5" />
        <h2 className="text-xl">Plan Your Journey</h2>
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="start-date" className="text-[#1e293b] font-semibold">
          Start Date
        </Label>
        <Input
          id="start-date"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          className="border-[#e2e8f0] focus:border-[#3b82f6]"
        />
      </div>

      {/* Route Selection */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="text-[#1e293b] font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Starting City
          </Label>
          <DestinationCitySelector
            value={formData.startCity}
            onChange={(city) => setFormData({ ...formData, startCity: city, endCity: '' })}
            placeholder="Choose your starting point"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#1e293b] font-semibold">
            Destination City
          </Label>
          <DestinationCitySelector
            value={formData.endCity}
            onChange={(city) => setFormData({ ...formData, endCity: city })}
            placeholder="Choose your destination"
            excludeCity={formData.startCity}
            disabled={!formData.startCity}
          />
        </div>
      </div>

      {/* Planning Type */}
      <div className="space-y-4">
        <Label className="text-[#1e293b] font-semibold">
          How would you like to plan your trip?
        </Label>
        <RadioGroup
          value={formData.planningType}
          onValueChange={(value: 'duration' | 'daily') => 
            setFormData({ ...formData, planningType: value })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="duration" id="duration" />
            <Label htmlFor="duration">Total trip duration (days)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily">Daily travel preferences</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Trip Duration */}
      {formData.planningType === 'duration' && (
        <div className="space-y-2">
          <Label htmlFor="trip-duration" className="text-[#1e293b] font-semibold">
            Trip Duration: {formData.tripDuration} days
          </Label>
          <Input
            id="trip-duration"
            type="range"
            min="3"
            max="21"
            value={formData.tripDuration}
            onChange={(e) => setFormData({ ...formData, tripDuration: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-[#64748b]">
            <span>3 days</span>
            <span>21 days</span>
          </div>
        </div>
      )}

      {/* Daily Preferences */}
      {formData.planningType === 'daily' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="daily-hours" className="text-[#1e293b] font-semibold">
              Hours per day
            </Label>
            <Input
              id="daily-hours"
              type="number"
              min="3"
              max="12"
              value={formData.dailyHours}
              onChange={(e) => setFormData({ ...formData, dailyHours: parseInt(e.target.value) || 6 })}
              className="border-[#e2e8f0] focus:border-[#3b82f6]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daily-miles" className="text-[#1e293b] font-semibold">
              Miles per day
            </Label>
            <Input
              id="daily-miles"
              type="number"
              min="100"
              max="600"
              step="50"
              value={formData.dailyMiles}
              onChange={(e) => setFormData({ ...formData, dailyMiles: parseInt(e.target.value) || 300 })}
              className="border-[#e2e8f0] focus:border-[#3b82f6]"
            />
          </div>
        </div>
      )}

      {/* Plan Button */}
      <Button
        onClick={handlePlanTrip}
        disabled={!isFormValid || isPlanning}
        className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3"
      >
        {isPlanning ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Planning Your Route 66 Adventure...
          </>
        ) : (
          'Start Planning Your Trip'
        )}
      </Button>

      {/* Info */}
      <div className="bg-[#f1f5f9] p-4 rounded-lg border border-[#e2e8f0]">
        <p className="text-sm text-[#1e293b] text-center">
          🚗 <strong>Smart Planning:</strong> Our planner uses real Route 66 destination cities 
          and attractions to create an authentic road trip experience with day-by-day itineraries!
        </p>
      </div>
    </div>
  );
};

export default Route66PlannerForm;
