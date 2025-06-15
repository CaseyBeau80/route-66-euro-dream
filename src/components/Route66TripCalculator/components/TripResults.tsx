
import React from 'react';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Route, Share2, DollarSign } from 'lucide-react';
import SimpleWeatherWidget from '../../TripCalculator/components/weather/SimpleWeatherWidget';
import { useCostEstimator } from '../../TripCalculator/hooks/useCostEstimator';
import TripSummaryStats from './TripSummaryStats';

interface TripResultsProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  onShareTrip?: () => void;
}

const TripResults: React.FC<TripResultsProps> = ({
  tripPlan,
  tripStartDate,
  onShareTrip
}) => {
  const { costEstimate } = useCostEstimator(tripPlan);

  console.log('📊 TripResults render:', { 
    tripPlan: !!tripPlan, 
    segmentCount: tripPlan?.segments?.length,
    tripStartDate: tripStartDate?.toISOString(),
    hasShareHandler: !!onShareTrip,
    hasCostEstimate: !!costEstimate,
    totalCost: costEstimate?.breakdown?.totalCost,
    segmentDriveTimes: tripPlan?.segments?.map(s => ({ 
      day: s.day, 
      driveTimeHours: s.driveTimeHours,
      distance: s.distance 
    }))
  });

  if (!tripPlan) {
    return null;
  }

  const handleShareTrip = () => {
    console.log('📤 TripResults: Share button clicked, calling parent handler');
    if (onShareTrip) {
      onShareTrip();
    } else {
      console.warn('⚠️ TripResults: No share handler provided by parent component');
    }
  };

  // FINAL FIX: Use actual segment drive time data from trip plan
  const formatDriveTime = (segment: any): string => {
    console.log('🕐 FINAL FIX: Formatting drive time for segment:', {
      day: segment.day,
      driveTimeHours: segment.driveTimeHours,
      distance: segment.distance,
      endCity: segment.endCity
    });

    // FINAL PRIORITY: Use segment's actual driveTimeHours if available
    if (segment.driveTimeHours && segment.driveTimeHours > 0) {
      const hours = Math.floor(segment.driveTimeHours);
      const minutes = Math.round((segment.driveTimeHours - hours) * 60);
      const formatted = `${hours}h ${minutes}m`;
      console.log('✅ FINAL FIX: Using actual segment driveTimeHours:', formatted);
      return formatted;
    }
    
    // FALLBACK: Calculate from distance if no drive time available
    if (segment.distance && segment.distance > 0) {
      const driveTimeHours = segment.distance / 50; // 50 mph average
      const hours = Math.floor(driveTimeHours);
      const minutes = Math.round((driveTimeHours - hours) * 60);
      const formatted = `${hours}h ${minutes}m`;
      console.log('⚠️ FINAL FIX: Calculated from distance:', formatted);
      return formatted;
    }
    
    console.log('❌ FINAL FIX: No valid data, using fallback');
    return '4h 0m';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Trip Summary */}
      <div className="text-center border-b border-route66-border pb-6">
        <h2 className="text-2xl font-bold text-route66-primary mb-2">
          Your Route 66 Adventure
        </h2>
        <p className="text-route66-text-secondary">
          {tripPlan.startCity} to {tripPlan.endCity}
        </p>
        
        <TripSummaryStats tripPlan={tripPlan} costEstimate={costEstimate} />
      </div>

      {/* Daily Segments */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-route66-primary mb-4">
          Daily Itinerary
        </h3>
        
        {tripPlan.segments?.map((segment, index) => (
          <Card key={index} className="p-4 border border-route66-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-route66-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {segment.day}
                </div>
                <div>
                  <h4 className="font-bold text-route66-text-primary">
                    Day {segment.day}
                  </h4>
                  <p className="text-sm text-route66-text-secondary">
                    {segment.startCity} → {segment.endCity}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-route66-text-secondary mt-2 md:mt-0">
                <div className="flex items-center gap-1">
                  <Route className="w-4 h-4" />
                  {Math.round(segment.distance)} miles
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDriveTime(segment)}
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            {tripStartDate && (
              <div className="mb-4">
                <SimpleWeatherWidget
                  segment={segment}
                  tripStartDate={tripStartDate}
                  isSharedView={false}
                />
              </div>
            )}

            {/* Attractions */}
            {segment.attractions && segment.attractions.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium text-route66-text-primary mb-2">
                  Recommended Stops:
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {segment.attractions.slice(0, 4).map((attraction, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <MapPin className="w-3 h-3 text-route66-primary flex-shrink-0" />
                      <span className="text-route66-text-secondary truncate">
                        {attraction.name}
                      </span>
                    </div>
                  ))}
                </div>
                {segment.attractions.length > 4 && (
                  <p className="text-xs text-route66-text-secondary mt-2">
                    +{segment.attractions.length - 4} more attractions
                  </p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleShareTrip}
          className="bg-route66-primary hover:bg-route66-primary/90 text-white px-6 py-2"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Trip
        </Button>
      </div>
    </div>
  );
};

export default TripResults;
