
import React from 'react';
import { Gauge } from 'lucide-react';

interface TripStyleSectionProps {
  tripStyle: 'balanced' | 'destination-focused';
  onTripStyleChange: (style: 'balanced' | 'destination-focused') => void;
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onTripStyleChange('balanced')}
          className={`p-4 border rounded-lg text-left transition-colors ${
            tripStyle === 'balanced'
              ? 'border-route66-primary bg-route66-primary/10 text-route66-primary'
              : 'border-route66-border hover:border-route66-primary/50'
          }`}
        >
          <div className="font-medium">Even Pacing</div>
          <div className="text-sm text-route66-text-secondary mt-1">
            Consistent drive times with diverse stops
          </div>
        </button>
        
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
            Prioritizes iconic Route 66 heritage locations
          </div>
        </button>
      </div>
    </div>
  );
};

export default TripStyleSection;
