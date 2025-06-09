
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRambleLogoUrl, getRambleLogoAlt } from '../../utils/logoConfig';

interface PlanYourOwnTripCTAProps {
  className?: string;
  variant?: 'full' | 'compact';
  currentPath?: string;
}

const PlanYourOwnTripCTA: React.FC<PlanYourOwnTripCTAProps> = ({
  className = '',
  variant = 'full',
  currentPath
}) => {
  const navigate = useNavigate();

  const handlePlanTrip = () => {
    // Add UTM parameters for tracking
    const params = new URLSearchParams({
      utm_source: 'shared_trip',
      utm_medium: 'cta_button',
      utm_campaign: 'plan_your_own',
      utm_content: currentPath || 'unknown'
    });
    
    navigate(`/trip-calculator?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <div className={`text-center ${className}`}>
        <Button
          onClick={handlePlanTrip}
          className="bg-route66-primary hover:bg-route66-rust text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <img 
            src={getRambleLogoUrl()}
            alt={getRambleLogoAlt('branding')}
            className="w-5 h-5 object-contain"
          />
          Plan Your Own Route 66 Trip
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-route66-primary to-route66-rust rounded-xl p-8 text-white text-center shadow-2xl ${className}`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 rounded-full p-4">
            <img 
              src={getRambleLogoUrl()}
              alt={getRambleLogoAlt('branding')}
              className="w-8 h-8 object-contain"
            />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-4">
          Ready for Your Own Route 66 Adventure?
        </h2>
        
        <p className="text-xl mb-6 text-white/90">
          Create your personalized Route 66 trip plan with Ramble 66. 
          Choose your route, set your pace, and discover the Mother Road your way.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span>Custom Routes</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span>Flexible Itineraries</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span>Hidden Gems</span>
          </div>
        </div>
        
        <Button
          onClick={handlePlanTrip}
          size="lg"
          className="bg-white text-route66-primary hover:bg-gray-100 font-bold px-8 py-4 rounded-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto text-lg"
        >
          <img 
            src={getRambleLogoUrl()}
            alt={getRambleLogoAlt('branding')}
            className="w-6 h-6 object-contain"
          />
          Start Planning Your Trip
          <ArrowRight className="w-5 h-5" />
        </Button>
        
        <p className="text-sm text-white/70 mt-4">
          Free to use • No account required • Instant results
        </p>
      </div>
    </div>
  );
};

export default PlanYourOwnTripCTA;
