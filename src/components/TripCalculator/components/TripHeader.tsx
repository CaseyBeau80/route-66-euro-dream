
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanTypes';
import ShareTripDropdown from './ShareTripDropdown';
import CalendarExportModal from './CalendarExportModal';

interface TripHeaderProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
}

const TripHeader: React.FC<TripHeaderProps> = ({ tripPlan, shareUrl, tripStartDate }) => {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=300&h=200&fit=crop";

  // Calculate total drive time from segments
  const totalDriveTimeHours = tripPlan.segments?.reduce((total, segment) => {
    return total + (segment.driveTimeHours || 0);
  }, 0) || 0;

  const formatDriveTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  };

  // Use segments for trip header data
  const segments = tripPlan.segments || [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  return (
    <>
      <Card className="vintage-paper-texture border-2 border-route66-border">
        <CardHeader className="bg-gradient-to-r from-route66-primary to-route66-primary-light text-white">
          <CardTitle className="font-route66 text-2xl text-center">
            {tripPlan.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-6 mb-6">
            <div className="flex-1 text-center">
              <div className="mb-3">
                <img 
                  src={tripPlan.startCityImage || fallbackImage} 
                  alt="Start City"
                  className="w-full h-32 object-cover rounded-lg border-2 border-route66-border"
                />
              </div>
              <h3 className="font-route66 text-lg text-route66-primary">Starting Point</h3>
              <p className="text-sm text-route66-text-secondary">{firstSegment?.startCity || tripPlan.startCity}</p>
            </div>
            
            <div className="flex-shrink-0 text-center px-4">
              <div className="bg-route66-primary text-white rounded-full px-4 py-2 font-route66 text-lg mb-2">
                {tripPlan.totalDays} DAYS
              </div>
              <div className="text-route66-text-secondary font-travel text-sm mb-1">
                {tripPlan.totalMiles || Math.round(tripPlan.totalDistance)} miles
              </div>
              <div className="text-route66-primary font-travel text-sm font-semibold">
                {formatDriveTime(totalDriveTimeHours)} drive time
              </div>
            </div>
            
            <div className="flex-1 text-center">
              <div className="mb-3">
                <img 
                  src={tripPlan.endCityImage || fallbackImage} 
                  alt="End City"
                  className="w-full h-32 object-cover rounded-lg border-2 border-route66-border"
                />
              </div>
              <h3 className="font-route66 text-lg text-route66-primary">Destination</h3>
              <p className="text-sm text-route66-text-secondary">{lastSegment?.endCity || tripPlan.endCity}</p>
            </div>
          </div>

          {/* Calendar Export Button */}
          <div className="flex justify-center mb-4">
            <Button
              onClick={() => setIsCalendarModalOpen(true)}
              className="bg-route66-primary hover:bg-route66-primary-dark text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              <Calendar className="w-4 h-4" />
              Export to Calendar
            </Button>
          </div>

          {/* Share Trip Dropdown */}
          <div className="flex justify-center">
            <ShareTripDropdown
              shareUrl={shareUrl}
              tripTitle={tripPlan.title}
              tripPlan={tripPlan}
              tripStartDate={tripStartDate}
            />
          </div>
        </CardContent>
      </Card>

      {/* Calendar Export Modal */}
      <CalendarExportModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
      />
    </>
  );
};

export default TripHeader;
