
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import ShareTripActions from '../ShareTripActions';

interface TripHeaderProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
}

const TripHeader: React.FC<TripHeaderProps> = ({ tripPlan, shareUrl }) => {
  const fallbackImage = "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=300&h=200&fit=crop";

  // Calculate total drive time from daily segments
  const totalDriveTimeHours = tripPlan.dailySegments.reduce((total, segment) => {
    // Parse drive time from string format like "2.5 hours" or "2h 30m"
    const timeStr = segment.drivingTime;
    let hours = 0;
    
    if (timeStr.includes('hours')) {
      hours = parseFloat(timeStr.split(' ')[0]);
    } else if (timeStr.includes('h')) {
      const parts = timeStr.split(' ');
      hours = parseInt(parts[0].replace('h', ''));
      if (parts[1] && parts[1].includes('m')) {
        hours += parseInt(parts[1].replace('m', '')) / 60;
      }
    }
    
    return total + hours;
  }, 0);

  const formatDriveTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  };

  return (
    <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
      <CardHeader className="bg-gradient-to-r from-route66-orange to-route66-vintage-yellow text-white">
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
                className="w-full h-32 object-cover rounded-lg border-2 border-route66-vintage-brown"
              />
            </div>
            <h3 className="font-route66 text-lg text-route66-vintage-red">Starting Point</h3>
            <p className="text-sm text-route66-vintage-brown">{tripPlan.dailySegments[0]?.startCity || "Unknown"}</p>
          </div>
          
          <div className="flex-shrink-0 text-center px-4">
            <div className="bg-route66-red text-white rounded-full px-4 py-2 font-route66 text-lg mb-2">
              {tripPlan.totalDays} DAYS
            </div>
            <div className="text-route66-vintage-brown font-travel text-sm mb-1">
              {tripPlan.totalMiles} miles
            </div>
            <div className="text-route66-vintage-blue font-travel text-sm font-semibold">
              {formatDriveTime(totalDriveTimeHours)} drive time
            </div>
          </div>
          
          <div className="flex-1 text-center">
            <div className="mb-3">
              <img 
                src={tripPlan.endCityImage || fallbackImage} 
                alt="End City"
                className="w-full h-32 object-cover rounded-lg border-2 border-route66-vintage-brown"
              />
            </div>
            <h3 className="font-route66 text-lg text-route66-vintage-red">Destination</h3>
            <p className="text-sm text-route66-vintage-brown">{tripPlan.dailySegments[tripPlan.dailySegments.length-1]?.endCity || "Unknown"}</p>
          </div>
        </div>

        {/* Share Actions */}
        <ShareTripActions shareUrl={shareUrl} tripTitle={tripPlan.title} />
      </CardContent>
    </Card>
  );
};

export default TripHeader;
