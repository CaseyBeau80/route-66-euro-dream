
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDestinationCities } from './hooks/useDestinationCities';

interface DestinationCitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  excludeCity?: string;
  disabled?: boolean;
}

const DestinationCitySelector: React.FC<DestinationCitySelectorProps> = ({
  value,
  onChange,
  placeholder,
  excludeCity,
  disabled = false
}) => {
  const { destinationCities, isLoading } = useDestinationCities();

  const availableCities = destinationCities.filter(city => 
    city.name !== excludeCity
  );

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="border-[#e2e8f0] focus:border-[#3b82f6]">
          <SelectValue placeholder="Loading cities..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="border-[#e2e8f0] focus:border-[#3b82f6]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {availableCities.map((city) => (
          <SelectItem key={city.id} value={city.name}>
            <div className="flex flex-col">
              <span className="font-medium">{city.name}</span>
              <span className="text-sm text-[#64748b]">{city.state}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DestinationCitySelector;
