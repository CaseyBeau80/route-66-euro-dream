
import React from 'react';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanTypes';
import { TripCompletionAnalysis } from '../../TripCalculator/services/planning/TripCompletionService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Route, Share2, DollarSign } from 'lucide-react';
import SegmentWeatherWidget from '../../TripCalculator/components/SegmentWeatherWidget';
import SimpleShareButton from './SimpleShareButton';
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

  // FIXED: Ensure we always have a valid trip start date with proper timezone handling
  const effectiveTripStartDate = React.useMemo(() => {
    if (tripStartDate && !isNaN(tripStartDate.getTime())) {
      // Normalize to prevent timezone drift
      const normalized = new Date(
        tripStartDate.getFullYear(),
        tripStartDate.getMonth(),
        tripStartDate.getDate(),
        12, 0, 0, 0
      );
      console.log('✅ Using provided tripStartDate:', {
        original: tripStartDate.toISOString(),
        normalized: normalized.toISOString(),
        originalLocal: tripStartDate.toLocaleDateString(),
        normalizedLocal: normalized.toLocaleDateString()
      });
      return normalized;
    }
    
    // Use today as fallback with proper normalization
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0, 0);
    console.log('🔄 Using today as fallback:', {
      today: today.toISOString(),
      normalized: normalizedToday.toISOString(),
      todayLocal: today.toLocaleDateString(),
      normalizedLocal: normalizedToday.toLocaleDateString()
    });
    return normalizedToday;
  }, [tripStartDate]);

  console.log('📊 TripResults rendering with FIXED weather system:', {
    tripPlan: !!tripPlan,
    segmentCount: tripPlan?.segments?.length,
    effectiveTripStartDate: effectiveTripStartDate.toISOString(),
    effectiveTripStartLocal: effectiveTripStartDate.toLocaleDateString(),
    hasCostEstimate: !!costEstimate,
    totalCost: costEstimate?.breakdown?.totalCost,
    fixedWeatherSystem: 'TripCalculator/SegmentWeatherWidget'
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

      {/* Daily Segments with FIXED Weather */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-route66-primary mb-4">
          Daily Itinerary with Weather Forecasts
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

            {/* FIXED Weather Widget - Using TripCalculator's SegmentWeatherWidget */}
            <div className="mb-4">
              <SegmentWeatherWidget 
                segment={segment} 
                tripStartDate={effectiveTripStartDate}
                cardIndex={index}
                sectionKey="enhanced-trip-results"
                forceExpanded={true}
                isCollapsible={false}
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

      {/* Share Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Share Your Route 66 Adventure
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Generate a shareable link for your trip plan
        </p>
        
        <div className="flex justify-center">
          <SimpleShareButton 
            tripPlan={tripPlan}
            tripStartDate={effectiveTripStartDate}
          />
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          Share your complete itinerary with friends and family
        </p>
      </div>
    </div>
  );
};

export default TripResults;
