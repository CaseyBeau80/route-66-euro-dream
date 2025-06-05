
import React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DestinationCitySelector from '../DestinationCitySelector';
import { PlannerFormData } from '../types';

interface DateAndLocationSectionProps {
  formData: PlannerFormData;
  setFormData: (data: PlannerFormData) => void;
}

const DateAndLocationSection: React.FC<DateAndLocationSectionProps> = ({
  formData,
  setFormData
}) => {
  return (
    <>
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
    </>
  );
};

export default DateAndLocationSection;
