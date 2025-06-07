
import React from 'react';
import { Calendar, Users } from 'lucide-react';
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
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-26 bg-route66-background rounded-lg border-2 border-route66-primary shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-1 border border-route66-border rounded-md"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="text-route66-text-muted text-xs font-semibold tracking-wider">ROUTE</div>
              <div className="text-route66-primary text-2xl font-black leading-none">66</div>
              <div className="text-route66-text-muted text-[8px] font-medium">SHARED TRIP</div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-lg bg-route66-primary/20 opacity-20 blur-lg animate-pulse"></div>
        </div>
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
          className="border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white"
        >
          Back to Home
        </Button>
        <Button
          onClick={onPlanNewTrip}
          className="bg-route66-primary hover:bg-route66-rust text-white"
        >
          Plan Your Own Trip
        </Button>
      </div>
    </div>
  );
};

export default TripDetailsHeader;
