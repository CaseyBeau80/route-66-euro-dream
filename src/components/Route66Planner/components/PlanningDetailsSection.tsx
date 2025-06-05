
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlannerFormData } from '../types';

interface PlanningDetailsSectionProps {
  formData: PlannerFormData;
  setFormData: (data: PlannerFormData) => void;
}

const PlanningDetailsSection: React.FC<PlanningDetailsSectionProps> = ({
  formData,
  setFormData
}) => {
  return (
    <>
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
    </>
  );
};

export default PlanningDetailsSection;
