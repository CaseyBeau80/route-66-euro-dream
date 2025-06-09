
import React from 'react';
import { Calendar, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SavedTrip } from '@/components/TripCalculator/services/TripService';
import RambleBranding from '@/components/shared/RambleBranding';
import PlanYourOwnTripCTA from '@/components/shared/PlanYourOwnTripCTA';

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
    <div className="text-center mb-8">
      {/* Ramble 66 Branding - Updated to use consistent sizing */}
      <div className="flex justify-center mb-6">
        <RambleBranding size="lg" />
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-route66-text-primary mb-4">
        {trip.title}
      </h1>
      
      {trip.description && (
        <p className="text-lg text-route66-text-secondary max-w-2xl mx-auto leading-relaxed mb-4">
          {trip.description}
        </p>
      )}

      {/* Trip Stats */}
      <div className="flex justify-center items-center gap-6 mb-8 text-sm text-route66-text-secondary">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>Created {new Date(trip.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{trip.view_count} views</span>
        </div>
      </div>

      {/* Plan Your Own Trip CTA */}
      <div className="mb-8">
        <PlanYourOwnTripCTA 
          variant="full" 
          currentPath={`/trip/${trip.share_code}`}
          className="max-w-4xl mx-auto"
        />
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
