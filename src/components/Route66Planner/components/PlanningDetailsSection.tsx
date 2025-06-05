
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
    <div className="space-y-4">
      {formData.planningType === 'duration' ? (
        <div className="space-y-2">
          <Label htmlFor="trip-duration" className="text-[#1e293b] font-semibold">
            Total Trip Duration (days)
          </Label>
          <Input
            id="trip-duration"
            type="number"
            min="1"
            max="30"
            value={formData.tripDuration}
            onChange={(e) => setFormData({ 
              ...formData, 
              tripDuration: parseInt(e.target.value) || 1 
            })}
            className="border-[#e2e8f0] focus:border-[#3b82f6]"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="daily-hours" className="text-[#1e293b] font-semibold">
              Daily Driving Hours
            </Label>
            <Input
              id="daily-hours"
              type="number"
              min="2"
              max="12"
              value={formData.dailyHours}
              onChange={(e) => setFormData({ 
                ...formData, 
                dailyHours: parseInt(e.target.value) || 6 
              })}
              className="border-[#e2e8f0] focus:border-[#3b82f6]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daily-miles" className="text-[#1e293b] font-semibold">
              Daily Miles Goal
            </Label>
            <Input
              id="daily-miles"
              type="number"
              min="100"
              max="800"
              value={formData.dailyMiles}
              onChange={(e) => setFormData({ 
                ...formData, 
                dailyMiles: parseInt(e.target.value) || 300 
              })}
              className="border-[#e2e8f0] focus:border-[#3b82f6]"
            />
          </div>
        </div>
      )}
      
      {/* Data refresh hint for debugging */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-600">
          💡 <strong>Tip:</strong> If you don't see a city in the dropdown, it may need to be added to our destination cities database. 
          Try refreshing the page to reload the latest city data.
        </p>
      </div>
    </div>
  );
};

export default PlanningDetailsSection;
