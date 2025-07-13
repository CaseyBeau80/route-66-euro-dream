
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TripFormData } from '../types/tripCalculator';
import { useDestinationCities } from '@/components/Route66Planner/hooks/useDestinationCities';

interface LocationSelectionFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
}

const LocationSelectionForm: React.FC<LocationSelectionFormProps> = ({
  formData,
  setFormData
}) => {
  const { destinationCities, isLoading } = useDestinationCities();
  
  const availableEndLocations = destinationCities.filter(city => 
    city.name !== formData.startLocation
  );
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
            {isLoading ? (
              <SelectItem value="" disabled>Loading cities...</SelectItem>
            ) : (
              destinationCities.map((city) => (
                <SelectItem key={city.id} value={city.name}>
                  <div className="flex flex-col">
                    <span className="font-medium">{city.name}</span>
                    <span className="text-sm text-muted-foreground">{city.state}</span>
                  </div>
                </SelectItem>
              ))
            )}
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
            {isLoading ? (
              <SelectItem value="" disabled>Loading cities...</SelectItem>
            ) : (
              availableEndLocations.map((city) => (
                <SelectItem key={city.id} value={city.name}>
                  <div className="flex flex-col">
                    <span className="font-medium">{city.name}</span>
                    <span className="text-sm text-muted-foreground">{city.state}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelectionForm;
