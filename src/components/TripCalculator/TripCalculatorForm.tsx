
import React from 'react';
import { route66Towns } from '@/types/route66';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TripFormData } from './types/tripCalculator';

interface TripCalculatorFormProps {
  formData: TripFormData;
  setFormData: React.Dispatch<React.SetStateAction<TripFormData>>;
  availableEndLocations: typeof route66Towns;
  onCalculate: () => void;
  isCalculateDisabled: boolean;
}

const TripCalculatorForm: React.FC<TripCalculatorFormProps> = ({
  formData,
  setFormData,
  availableEndLocations,
  onCalculate,
  isCalculateDisabled
}) => {
  const updateFormData = (updates: Partial<TripFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      {/* Start Location */}
      <div className="space-y-2">
        <Label className="font-travel font-bold text-route66-vintage-brown">
          Start Location
        </Label>
        <Select value={formData.startLocation} onValueChange={(value) => updateFormData({ startLocation: value })}>
          <SelectTrigger className="border-2 border-route66-tan">
            <SelectValue placeholder="Select starting city" />
          </SelectTrigger>
          <SelectContent>
            {route66Towns.map((town) => (
              <SelectItem key={town.name} value={town.name}>
                {town.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* End Location */}
      <div className="space-y-2">
        <Label className="font-travel font-bold text-route66-vintage-brown">
          End Location
        </Label>
        <Select value={formData.endLocation} onValueChange={(value) => updateFormData({ endLocation: value })}>
          <SelectTrigger className="border-2 border-route66-tan">
            <SelectValue placeholder="Select destination city" />
          </SelectTrigger>
          <SelectContent>
            {availableEndLocations.map((town) => (
              <SelectItem key={town.name} value={town.name}>
                {town.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Number of Travel Days */}
      <div className="space-y-2">
        <Label className="font-travel font-bold text-route66-vintage-brown">
          Number of Travel Days (Optional)
        </Label>
        <Input
          type="number"
          min="0"
          max="30"
          value={formData.travelDays || ''}
          onChange={(e) => updateFormData({ travelDays: Number(e.target.value) || 0 })}
          placeholder="Leave blank to auto-calculate"
          className="border-2 border-route66-tan"
        />
        <p className="text-xs text-route66-vintage-brown opacity-75">
          Leave blank to calculate based on daily driving limit
        </p>
      </div>

      {/* Daily Driving Limit */}
      <div className="space-y-4">
        <Label className="font-travel font-bold text-route66-vintage-brown">
          Preferred Daily Driving Limit: {formData.dailyDrivingLimit[0]} miles/day
        </Label>
        <div className="px-2">
          <Slider
            value={formData.dailyDrivingLimit}
            onValueChange={(value) => updateFormData({ dailyDrivingLimit: value })}
            max={500}
            min={100}
            step={25}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-route66-vintage-brown opacity-75 mt-1">
            <span>100 mi</span>
            <span>300 mi</span>
            <span>500 mi</span>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <Button
        onClick={onCalculate}
        disabled={isCalculateDisabled}
        className="w-full vintage-button"
      >
        Calculate Trip
      </Button>
    </div>
  );
};

export default TripCalculatorForm;
