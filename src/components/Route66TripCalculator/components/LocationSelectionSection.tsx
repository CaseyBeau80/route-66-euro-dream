
import React from 'react';
import { MapPin } from 'lucide-react';
import { route66Towns } from '@/types/route66';

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
  const availableEndLocations = route66Towns.filter(
    town => town.name !== startLocation
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
          {route66Towns.map((town) => (
            <option key={town.name} value={town.name}>
              {town.name}, {town.state}
            </option>
          ))}
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
          {availableEndLocations.map((town) => (
            <option key={town.name} value={town.name}>
              {town.name}, {town.state}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelectionSection;
