
import React from 'react';
import { Gauge } from 'lucide-react';

interface TripStyleSectionProps {
  tripStyle: 'destination-focused';
  onTripStyleChange: (style: 'destination-focused') => void;
}

const TripStyleSection: React.FC<TripStyleSectionProps> = ({
  tripStyle,
  onTripStyleChange
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-route66-text-primary">
        <Gauge className="inline w-4 h-4 mr-1" />
        Trip Style
      </label>
      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => onTripStyleChange('destination-focused')}
          className={`p-4 border rounded-lg text-left transition-colors ${
            tripStyle === 'destination-focused'
              ? 'border-route66-primary bg-route66-primary/10 text-route66-primary'
              : 'border-route66-border hover:border-route66-primary/50'
          }`}
        >
          <div className="font-medium">Heritage Cities</div>
          <div className="text-sm text-route66-text-secondary mt-1">
            Prioritizes iconic Route 66 heritage locations with optimized drive times
          </div>
        </button>
      </div>
    </div>
  );
};

export default TripStyleSection;
