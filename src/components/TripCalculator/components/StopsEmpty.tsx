
import React from 'react';
import { MapPin } from 'lucide-react';

const StopsEmpty: React.FC = () => {
  return (
    <div className="text-center p-4 bg-route66-background-alt rounded-lg border border-route66-border">
      <MapPin className="h-8 w-8 text-route66-text-secondary mx-auto mb-2" />
      <p className="text-sm text-route66-vintage-brown italic">
        Direct drive - no specific stops planned for this segment
      </p>
      <p className="text-xs text-route66-text-secondary mt-1">
        This is a travel day focused on covering distance efficiently
      </p>
    </div>
  );
};

export default StopsEmpty;
