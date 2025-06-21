
import React from 'react';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanTypes';
import { TripCompletionAnalysis } from '../../TripCalculator/services/planning/TripCompletionService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Route, Share2, DollarSign } from 'lucide-react';
import PriorityWeatherWidget from '../../TripCalculator/components/weather/PriorityWeatherWidget';
import TripCompletionWarning from '../../TripCalculator/components/TripCompletionWarning';
import TripShareButton from '../../TripCalculator/components/TripShareButton';
import { useCostEstimator } from '../../TripCalculator/hooks/useCostEstimator';

interface TripResultsProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays?: number;
  onShareTrip?: () => void;
}

const TripResults: React.FC<TripResultsProps> = ({
  tripPlan,
  tripStartDate,
  completionAnalysis,
  originalRequestedDays,
  onShareTrip
}) => {
  const {
    costEstimate
  } = useCostEstimator(tripPlan);

  // Ensure we have a valid trip start date
  const effectiveTripStartDate = React.useMemo(() => {
    if (tripStartDate && !isNaN(tripStartDate.getTime())) {
      console.log('✅ FIXED TRIP RESULTS: Using provided tripStartDate:', tripStartDate.toISOString());
      return tripStartDate;
    }
    
    // Default to today if no date provided
    const today = new Date();
    console.log('🔄 FIXED TRIP RESULTS: Using today as fallback:', today.toISOString());
    return today;
  }, [tripStartDate]);

  console.log('📊 FIXED TRIP RESULTS: Rendering with priority weather system:', {
    tripPlan: !!tripPlan,
    segmentCount: tripPlan?.segments?.length,
    effectiveTripStartDate: effectiveTripStartDate.toISOString(),
    hasCostEstimate: !!costEstimate,
    totalCost: costEstimate?.breakdown?.totalCost,
    hasCompletionAnalysis: !!completionAnalysis,
    originalRequestedDays,
    fixedWeatherSystem: true
  });

  if (!tripPlan) {
    return null;
  }

  const handleShareTrip = () => {
    console.log('📤 FIXED TRIP RESULTS: Share button clicked');
    if (onShareTrip) {
      onShareTrip();
    } else {
      console.warn('⚠️ FIXED TRIP RESULTS: No share handler provided');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Use fallback properties to ensure compatibility
  const startCity = tripPlan.startCity || tripPlan.segments?.[0]?.startCity || tripPlan.startLocation || 'Start';
  const endCity = tripPlan.endCity || tripPlan.segments?.[tripPlan.segments.length - 1]?.endCity || tripPlan.endLocation || 'End';
  const segments = tripPlan.segments || tripPlan.dailySegments || [];

  // Determine if we should show the completion warning
  const shouldShowCompletionWarning = completionAnalysis && originalRequestedDays && 
    (completionAnalysis.isCompleted || (completionAnalysis.duplicateSegments && completionAnalysis.duplicateSegments.length > 0)) &&
    (originalRequestedDays > (completionAnalysis.totalUsefulDays || 0));

  return (
    <div className="space-y-6 p-6">
      {/* Trip Completion Warning */}
      {shouldShowCompletionWarning && (
        <TripCompletionWarning
          analysis={completionAnalysis}
          originalRequestedDays={originalRequestedDays}
        />
      )}

      {/* Trip Summary */}
      <div className="text-center border-b border-route66-border pb-6">
        <h2 className="text-2xl font-bold text-route66-primary mb-2">
          Your Route 66 Adventure
        </h2>
        <p className="text-route66-text-secondary">
          {startCity} to {endCity}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-route66-primary">{segments.length || 0}</div>
            <div className="text-sm text-route66-text-secondary">Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-route66-primary">
              {Math.round(tripPlan.totalDistance || tripPlan.totalMiles || 0)}
            </div>
            <div className="text-sm text-route66-text-secondary">Miles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-route66-primary">
              {Math.round(tripPlan.totalDrivingTime || ((tripPlan.totalDistance || tripPlan.totalMiles || 0) / 55))}
            </div>
            <div className="text-sm text-route66-text-secondary">Drive Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-route66-primary">
              {costEstimate ? formatCurrency(costEstimate.breakdown.totalCost) : '--'}
            </div>
            <div className="text-sm text-route66-text-secondary">Est. Cost</div>
          </div>
        </div>
      </div>

      {/* Daily Segments with FIXED Priority Weather System */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-route66-primary mb-4">
          Daily Itinerary with Live Weather
        </h3>
        
        {segments.map((segment, index) => (
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
                    {segment.startCity || 'Start'} → {segment.endCity || 'End'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-route66-text-secondary mt-2 md:mt-0">
                <div className="flex items-center gap-1">
                  <Route className="w-4 h-4" />
                  {Math.round(segment.distance || segment.approximateMiles || 0)} miles
                  {segment.isGoogleMapsData && (
                    <span className="text-xs text-green-600 ml-1">📍</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {segment.driveTimeHours ? 
                    `${Math.round(segment.driveTimeHours * 10) / 10}h` :
                    `${Math.round((segment.distance || segment.approximateMiles || 0) / 55 * 10) / 10}h`
                  }
                </div>
              </div>
            </div>

            {/* FIXED: Priority Weather Widget with proper tripStartDate */}
            <div className="mb-4">
              <PriorityWeatherWidget 
                segment={segment} 
                tripStartDate={effectiveTripStartDate}
                isSharedView={false}
                isPDFExport={false}
              />
            </div>

            {/* Attractions */}
            {segment.attractions && segment.attractions.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-route66-text-primary mb-2">
                  Recommended Stops:
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {segment.attractions.map((attraction: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-route66-text-secondary">
                      <MapPin className="w-3 h-3 text-route66-accent" />
                      <span>{attraction.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* FIXED: Action Buttons - Ensure Share Button is Visible */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t border-route66-border">
        <TripShareButton 
          tripPlan={tripPlan}
          tripStartDate={effectiveTripStartDate}
          useLiveWeather={true}
          className="bg-route66-primary hover:bg-route66-primary/90 text-white px-6 py-3 min-w-[200px] flex items-center justify-center gap-2"
        />
        
        {onShareTrip && (
          <Button 
            onClick={handleShareTrip}
            className="bg-route66-accent hover:bg-route66-accent/90 text-white px-6 py-3 min-w-[200px]"
            variant="outline"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Custom Share
          </Button>
        )}
      </div>
    </div>
  );
};

export default TripResults;
