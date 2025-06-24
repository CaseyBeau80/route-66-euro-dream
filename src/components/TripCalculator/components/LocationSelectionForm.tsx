
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
  console.log('🗺️ LocationSelectionForm render:', {
    startLocation: formData.startLocation,
    endLocation: formData.endLocation,
    totalTowns: route66Towns.length,
    availableEndLocations: availableEndLocations.length
  });

  // Debug the data structure
  console.log('🏘️ Sample towns:', route66Towns.slice(0, 5).map(town => ({
    name: town.name,
    state: town.state,
    fullName: `${town.name}, ${town.state}`
  })));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Starting City */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Starting City</Label>
        <Select 
          value={formData.startLocation} 
          onValueChange={(value) => {
            console.log('🏁 Start location changed:', value);
            setFormData({ ...formData, startLocation: value, endLocation: '' });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose your starting point" />
          </SelectTrigger>
          <SelectContent>
            {route66Towns.map((town, index) => {
              const displayText = `${town.name}, ${town.state}`;
              const uniqueKey = `start-${town.name}-${town.state}-${index}`;
              
              console.log(`🏪 Rendering start option ${index}:`, { displayText, uniqueKey, value: displayText });
              
              return (
                <SelectItem key={uniqueKey} value={displayText}>
                  {displayText}
                </SelectItem>
              );
            })}
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
          disabled={!formData.startLocation}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose your destination" />
          </SelectTrigger>
          <SelectContent>
            {availableEndLocations.map((town, index) => {
              const displayText = `${town.name}, ${town.state}`;
              const uniqueKey = `end-${town.name}-${town.state}-${index}`;
              
              console.log(`🎯 Rendering end option ${index}:`, { displayText, uniqueKey, value: displayText });
              
              return (
                <SelectItem key={uniqueKey} value={displayText}>
                  {displayText}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelectionForm;
