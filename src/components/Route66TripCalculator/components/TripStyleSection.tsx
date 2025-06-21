
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
        <div className="p-4 border-2 border-route66-primary bg-route66-primary/10 rounded-lg">
          <div className="font-medium text-route66-primary">Heritage Cities Focus</div>
          <div className="text-sm text-route66-text-secondary mt-1">
            Prioritizes iconic Route 66 heritage locations with realistic drive times (max 8 hours/day)
          </div>
          <div className="text-xs text-route66-text-secondary mt-2 opacity-75">
            ✓ Drive time limits enforced ✓ Minimum 3 days ✓ Maximum 14 days
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripStyleSection;
