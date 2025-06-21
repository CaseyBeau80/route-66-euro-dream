
import React from 'react';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanTypes';
import { TripCompletionAnalysis } from '../../TripCalculator/services/planning/TripCompletionService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Route, Share2, DollarSign } from 'lucide-react';
import UnifiedWeatherWidget from '../../TripCalculator/components/weather/UnifiedWeatherWidget';
import SimpleShareButton from '../../TripCalculator/components/share/SimpleShareButton';
import TripCompletionWarning from '../../TripCalculator/components/TripCompletionWarning';
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

  // FIXED: Ensure we have a valid date for weather display
  const validTripStartDate = React.useMemo(() => {
    console.log('🔧 TripResults: Validating tripStartDate:', {
      inputDate: tripStartDate,
      inputType: typeof tripStartDate,
      isDate: tripStartDate instanceof Date,
      isValidDate: tripStartDate instanceof Date && !isNaN(tripStartDate.getTime()),
      timestamp: new Date().toISOString()
    });

    if (tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())) {
      const normalized = new Date(tripStartDate);
      normalized.setHours(12, 0, 0, 0); // Normalize to noon to avoid timezone issues
      console.log('✅ TripResults: Using valid tripStartDate:', {
        original: tripStartDate.toISOString(),
        normalized: normalized.toISOString()
      });
      return normalized;
    }

    // Use today as fallback
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    console.log('🔄 TripResults: Using today as fallback date:', {
      fallback: today.toISOString(),
      reason: tripStartDate ? 'invalid_date' : 'no_date_provided'
    });
    return today;
  }, [tripStartDate]);

  console.log('📊 TripResults rendering with validated date:', {
    hasTripPlan: !!tripPlan,
    originalTripStartDate: tripStartDate?.toISOString(),
    validTripStartDate: validTripStartDate.toISOString(),
    segmentCount: tripPlan?.segments?.length
  });

  if (!tripPlan) {
    return null;
  }

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

  // Build trip title for sharing
  const tripTitle = `${startCity} to ${endCity} Route 66 Trip`;

  return (
    <div className="space-y-6 p-6">
      {/* Trip Completion Warning */}
      {shouldShowCompletionWarning && (
        <TripCompletionWarning
          analysis={completionAnalysis}
          originalRequestedDays={originalRequestedDays}
        />
      )}

      {/* PROMINENT Share Button at the very top */}
      <div className="flex justify-center mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-xl shadow-2xl">
          <SimpleShareButton
            title={tripTitle}
            variant="outline"
            size="lg"
            className="bg-white hover:bg-gray-50 text-blue-700 hover:text-blue-800 px-12 py-6 text-xl font-bold shadow-xl border-0 rounded-lg"
          />
        </div>
      </div>

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

      {/* Daily Segments with Weather */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-route66-primary">
            Daily Itinerary with Weather Forecasts
          </h3>
          
          {/* Another Share Button in section header */}
          <SimpleShareButton
            title={tripTitle}
            variant="outline"
            size="default"
            className="border-2 border-blue-500 text-blue-700 hover:bg-blue-50"
          />
        </div>
        
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

            {/* FIXED: Always pass validTripStartDate to weather widget */}
            <div className="mb-4">
              <UnifiedWeatherWidget 
                segment={segment} 
                tripStartDate={validTripStartDate}
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

      {/* LARGE Share Section at the bottom */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-4 border-blue-300 rounded-2xl p-8 text-center shadow-xl">
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            Share Your Route 66 Adventure!
          </h3>
        </div>
        
        <p className="text-gray-700 mb-6 text-lg max-w-2xl mx-auto">
          Love this trip plan? Share it with friends and family! They'll get the complete itinerary with weather forecasts and attractions.
        </p>
        
        <SimpleShareButton
          title={tripTitle}
          variant="default"
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105"
        />
        
        <p className="text-gray-600 mt-4">
          🎯 Click above to copy your shareable trip link!
        </p>
      </div>
    </div>
  );
};

export default TripResults;
