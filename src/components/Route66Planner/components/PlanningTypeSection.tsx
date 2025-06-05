
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlannerFormData } from '../types';

interface PlanningTypeSectionProps {
  formData: PlannerFormData;
  setFormData: (data: PlannerFormData) => void;
}

const PlanningTypeSection: React.FC<PlanningTypeSectionProps> = ({
  formData,
  setFormData
}) => {
  return (
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
  );
};

export default PlanningTypeSection;
