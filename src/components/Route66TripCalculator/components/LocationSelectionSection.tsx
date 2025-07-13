
import React from 'react';
import { MapPin } from 'lucide-react';
import { useDestinationCities } from '@/components/Route66Planner/hooks/useDestinationCities';

interface LocationSelectionSectionProps {
  startLocation: string;
  endLocation: string;
  onLocationChange: (type: 'start' | 'end', location: string) => void;
}

const LocationSelectionSection: React.FC<LocationSelectionSectionProps> = ({
  startLocation,
  endLocation,
  onLocationChange
}) => {
  const { destinationCities, isLoading } = useDestinationCities();
  
  const availableEndLocations = destinationCities.filter(
    city => city.name !== startLocation
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-route66-text-primary">
          <MapPin className="inline w-4 h-4 mr-1" />
          Start Location
        </label>
        <select
          value={startLocation}
          onChange={(e) => onLocationChange('start', e.target.value)}
          className="w-full p-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent"
        >
          <option value="">Choose starting point</option>
          {isLoading ? (
            <option value="" disabled>Loading cities...</option>
          ) : (
            destinationCities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}, {city.state}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-route66-text-primary">
          <MapPin className="inline w-4 h-4 mr-1" />
          End Location
        </label>
        <select
          value={endLocation}
          onChange={(e) => onLocationChange('end', e.target.value)}
          disabled={!startLocation}
          className="w-full p-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Choose destination</option>
          {isLoading ? (
            <option value="" disabled>Loading cities...</option>
          ) : (
            availableEndLocations.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}, {city.state}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
};

export default LocationSelectionSection;
