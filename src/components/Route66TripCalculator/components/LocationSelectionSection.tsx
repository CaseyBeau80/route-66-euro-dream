
import React from 'react';
import { MapPin } from 'lucide-react';
import { useDestinationCities } from '@/components/Route66Planner/hooks/useDestinationCities';
import { SupabaseConnectionTest } from '@/services/SupabaseConnectionTest';

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
  
  // Run connection test on component mount
  React.useEffect(() => {
    const runConnectionTest = async () => {
      console.log('🧪 [DEBUG] Running connection test...');
      const result = await SupabaseConnectionTest.testConnection();
      
      if (!result.success) {
        console.error('❌ [DEBUG] Connection test failed:', result.error);
      } else if (!result.data?.hasSpringfieldMO) {
        console.log('⚠️ [DEBUG] Springfield, MO missing, testing migration...');
        await SupabaseConnectionTest.testSpecificMigration();
      }
    };
    
    runConnectionTest();
  }, []);
  
  console.log('🎯 [DEBUG] LocationSelectionSection render:', {
    destinationCitiesCount: destinationCities.length,
    isLoading,
    startLocation,
    endLocation,
    cities: destinationCities.map(c => `${c.name}, ${c.state}`)
  });
  
  const springfieldMO = destinationCities.find(c => c.name === 'Springfield' && c.state === 'MO');
  console.log('🔍 [DEBUG] LocationSelectionSection: Springfield, MO in dropdown:', !!springfieldMO, springfieldMO);
  
  const availableEndLocations = destinationCities.filter(
    city => `${city.name}, ${city.state}` !== startLocation
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
              <option key={city.id} value={`${city.name}, ${city.state}`}>
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
              <option key={city.id} value={`${city.name}, ${city.state}`}>
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
