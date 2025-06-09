
import React from 'react';
import { Calendar, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SavedTrip } from '@/components/TripCalculator/services/TripService';

interface TripDetailsHeaderProps {
  trip: SavedTrip;
  onBackToHome: () => void;
  onPlanNewTrip: () => void;
}

const TripDetailsHeader: React.FC<TripDetailsHeaderProps> = ({ 
  trip, 
  onBackToHome, 
  onPlanNewTrip 
}) => {
  return (
    <div className="text-center mb-6">
      {/* Minimal Trip Stats */}
      <div className="flex justify-center items-center gap-6 mb-6 text-sm text-route66-text-secondary">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>Created {new Date(trip.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{trip.view_count} views</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onBackToHome}
          variant="outline"
          className="border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default TripDetailsHeader;
