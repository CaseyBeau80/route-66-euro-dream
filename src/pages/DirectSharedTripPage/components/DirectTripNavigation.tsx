
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';

interface DirectTripNavigationProps {
  startCity: string;
  endCity: string;
  totalDays: number;
}

const DirectTripNavigation: React.FC<DirectTripNavigationProps> = ({
  startCity,
  endCity,
  totalDays
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/trip-calculator')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Plan Your Own Trip
          </Button>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{startCity} → {endCity}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{totalDays} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectTripNavigation;
