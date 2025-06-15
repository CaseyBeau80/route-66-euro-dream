
import React from 'react';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Route, Share2, DollarSign } from 'lucide-react';
import { useCostEstimator } from '../../TripCalculator/hooks/useCostEstimator';
import TripSummaryStats from './TripSummaryStats';
import SimpleWeatherDisplay from '../../TripCalculator/components/weather/SimpleWeatherDisplay';
import { DriveTimeCalculator } from '../../TripCalculator/components/utils/DriveTimeCalculator';
import { useEdgeFunctionWeather } from '../../TripCalculator/components/weather/hooks/useEdgeFunctionWeather';
import { WeatherUtilityService } from '../../TripCalculator/components/weather/services/WeatherUtilityService';

interface TripResultsProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  onShareTrip?: () => void;
}

const CompactWeatherDisplay: React.FC<{
  segment: any;
  tripStartDate: Date;
}> = ({ segment, tripStartDate }) => {
  const segmentDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
  
  const { weather, loading } = useEdgeFunctionWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day
  });

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
        <div className="text-blue-600 text-sm">Loading weather...</div>
      </div>
    );
  }

  if (weather) {
    return (
      <SimpleWeatherDisplay
        weather={weather}
        segmentDate={segmentDate}
        cityName={segment.endCity}
        isSharedView={false}
        isPDFExport={false}
      />
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
      <div className="text-gray-600 text-sm">Weather unavailable</div>
    </div>
  );
};

const TripResults: React.FC<TripResultsProps> = ({
  tripPlan,
  tripStartDate,
  onShareTrip
}) => {
  const { costEstimate } = useCostEstimator(tripPlan);

  if (!tripPlan) {
    return null;
  }

  const handleShareTrip = () => {
    if (onShareTrip) {
      onShareTrip();
    }
  };

  console.log('🔧 FIXED: TripResults using fixed DriveTimeCalculator:', {
    segmentCount: tripPlan.segments?.length,
    tripStartDate: tripStartDate?.toISOString(),
    firstSegment: tripPlan.segments?.[0]
  });

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
        
        {tripPlan.segments?.map((segment, index) => {
          console.log(`🔧 FIXED: Rendering segment ${index} for ${segment.endCity}:`, {
            segmentData: {
              day: segment.day,
              driveTimeHours: segment.driveTimeHours,
              distance: segment.distance,
              startCity: segment.startCity,
              endCity: segment.endCity
            },
            hasValidDriveTime: typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0,
            hasValidDistance: typeof segment.distance === 'number' && segment.distance > 0,
            tripStartDate: tripStartDate?.toISOString()
          });

          return (
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
                    {DriveTimeCalculator.formatDriveTime(segment)}
                  </div>
                </div>
              </div>

              {/* Weather Display using working component */}
              {tripStartDate && (
                <CompactWeatherDisplay
                  segment={segment}
                  tripStartDate={tripStartDate}
                />
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
          );
        })}
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
