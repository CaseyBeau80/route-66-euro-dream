
import React from 'react';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Route, Share2 } from 'lucide-react';
import SimpleWeatherWidget from '../../TripCalculator/components/weather/SimpleWeatherWidget';
import ImprovedUrlShareButton from '../../TripCalculator/components/ImprovedUrlShareButton';
import { useWeatherDataCollection } from '../../TripCalculator/hooks/useWeatherDataCollection';

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
  const { weatherData } = useWeatherDataCollection(tripPlan, tripStartDate);

  console.log('📊 TripResults render:', { 
    tripPlan: !!tripPlan, 
    segmentCount: tripPlan?.segments?.length,
    tripStartDate: tripStartDate?.toISOString(),
    hasShareHandler: !!onShareTrip,
    weatherDataEntries: Object.keys(weatherData).length
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-route66-primary">{tripPlan.segments?.length || 0}</div>
            <div className="text-sm text-route66-text-secondary">Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-route66-primary">
              {Math.round(tripPlan.totalDistance || 0)}
            </div>
            <div className="text-sm text-route66-text-secondary">Miles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-route66-primary">
              {Math.round((tripPlan.totalDistance || 0) / 55)}
            </div>
            <div className="text-sm text-route66-text-secondary">Drive Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-route66-primary">
              {tripPlan.segments?.filter(s => s.attractions?.length > 0).length || 0}
            </div>
            <div className="text-sm text-route66-text-secondary">Attractions</div>
          </div>
        </div>
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
                  {Math.round(segment.distance / 55 * 10) / 10} hours
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
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        {/* Simple URL Generator - The main button for creating a shareable link */}
        <ImprovedUrlShareButton
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          className="px-6 py-3 text-lg"
        />

        {/* Traditional Share Modal Button */}
        <Button 
          onClick={handleShareTrip}
          variant="outline"
          className="gap-2 px-6 py-3 text-lg border-route66-primary text-route66-primary hover:bg-route66-primary hover:text-white"
        >
          <Share2 className="w-5 h-5" />
          Advanced Share Options
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center text-sm text-route66-text-secondary mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="font-medium mb-1">🔗 Quick Share</p>
        <p>Click "Generate Trip URL" to create a shareable link with all your trip information and weather forecasts. Perfect for sharing with travel companions!</p>
      </div>
    </div>
  );
};

export default TripResults;
