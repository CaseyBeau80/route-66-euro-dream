
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TripFormData } from '../types/tripCalculator';
import { route66Towns } from '@/types/route66';

interface LocationSelectionFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
  availableEndLocations: typeof route66Towns;
}

const LocationSelectionForm: React.FC<LocationSelectionFormProps> = ({
  formData,
  setFormData,
  availableEndLocations
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Starting City */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Starting City</Label>
        <Select 
          value={formData.startLocation} 
          onValueChange={(value) => {
            console.log('🏁 Start location changed:', value);
            setFormData({ ...formData, startLocation: value });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose your starting point" />
          </SelectTrigger>
          <SelectContent>
            {route66Towns.map((town) => (
              <SelectItem key={town.name} value={town.name}>
                {town.name}, {town.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Destination City */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Destination City</Label>
        <Select 
          value={formData.endLocation} 
          onValueChange={(value) => {
            console.log('🎯 End location changed:', value);
            setFormData({ ...formData, endLocation: value });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose your destination" />
          </SelectTrigger>
          <SelectContent>
            {availableEndLocations.map((town) => (
              <SelectItem key={town.name} value={town.name}>
                {town.name}, {town.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelectionForm;
