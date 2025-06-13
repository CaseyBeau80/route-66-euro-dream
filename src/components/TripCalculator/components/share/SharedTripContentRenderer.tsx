
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { format } from 'date-fns';
import { useCostEstimator } from '../../hooks/useCostEstimator';
import SegmentWeatherWidget from '../SegmentWeatherWidget';

interface SharedTripContentRendererProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string;
  isSharedView?: boolean;
}

const SharedTripContentRenderer: React.FC<SharedTripContentRendererProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  isSharedView = false
}) => {
  console.log('📤 SharedTripContentRenderer: Rendering shared content with weather');
  console.log('📤 TripPlan segments data:', tripPlan.segments?.map(s => ({
    day: s.day,
    startCity: s.startCity,
    endCity: s.endCity,
    distance: s.distance,
    drivingTime: s.drivingTime,
    driveTimeHours: s.driveTimeHours,
    approximateMiles: s.approximateMiles,
    allProperties: Object.keys(s)
  })));

  // Get cost estimate for the trip
  const { costEstimate } = useCostEstimator(tripPlan);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to safely get driving time
  const getDrivingTime = (segment: any): number => {
    console.log('🚗 Getting driving time for segment:', {
      day: segment.day,
      drivingTime: segment.drivingTime,
      driveTimeHours: segment.driveTimeHours,
      distance: segment.distance,
      approximateMiles: segment.approximateMiles
    });
    
    // Try multiple possible properties for driving time in order of preference
    const possibleTimes = [
      segment.drivingTime,
      segment.driveTimeHours
    ];
    
    for (const time of possibleTimes) {
      if (typeof time === 'number' && !isNaN(time) && time > 0) {
        console.log('🚗 Found valid driving time:', time);
        return time;
      }
    }
    
    // Fallback: calculate from distance if available
    const distance = segment.distance || segment.approximateMiles;
    if (distance && typeof distance === 'number' && !isNaN(distance) && distance > 0) {
      // Assume average speed of 55 mph for Route 66
      const calculatedTime = distance / 55;
      console.log('🚗 Calculated driving time from distance:', calculatedTime, 'from distance:', distance);
      return calculatedTime;
    }
    
    // Final fallback
    console.log('🚗 No valid driving time found, returning 0');
    return 0;
  };

  const segments = tripPlan.segments || [];
  const enrichedSegments = segments.filter(segment => 
    segment && segment.day && (segment.endCity || segment.destination)
  );

  return (
    <div className="bg-white text-black font-sans">
      {/* Trip Overview Header with Cost Integration */}
      <div className="mb-8 p-6 bg-gradient-to-r from-route66-cream to-route66-vintage-beige rounded-lg border-2 border-route66-vintage-brown">
        <h2 className="text-xl font-bold text-route66-vintage-red mb-4 font-route66 text-center">
          🛣️ YOUR ROUTE 66 JOURNEY OVERVIEW
        </h2>
        <div className={`grid gap-4 text-sm ${costEstimate ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4'}`}>
          <div className="text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
            <div className="font-bold text-route66-primary text-lg font-route66">From {tripPlan.startCity}</div>
            <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Starting Point</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
            <div className="font-bold text-route66-primary text-lg font-route66">To {tripPlan.endCity}</div>
            <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Destination</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
            <div className="font-bold text-route66-vintage-red text-lg font-route66">{tripPlan.totalDays}</div>
            <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Adventure Days</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
            <div className="font-bold text-route66-vintage-red text-lg font-route66">{Math.round(tripPlan.totalDistance)}</div>
            <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Historic Miles</div>
          </div>
          {/* Estimated Cost Card - Only show if cost estimate is available */}
          {costEstimate && (
            <div className="text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
              <div className="font-bold text-route66-vintage-red text-lg font-route66">
                {formatCurrency(costEstimate.breakdown.totalCost)}
              </div>
              <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Estimated Cost</div>
            </div>
          )}
        </div>
        
        {/* Journey Description */}
        <div className="mt-4 p-4 bg-route66-vintage-yellow rounded border border-route66-tan text-center">
          <p className="text-sm text-route66-navy font-travel">
            <strong>🗺️ Experience America's Main Street:</strong> This carefully planned itinerary takes you through 
            the heart of Route 66, featuring historic landmarks, classic diners, vintage motels, and unforgettable 
            roadside attractions that define the spirit of the open road.
          </p>
          {/* Cost breakdown summary if available */}
          {costEstimate && (
            <div className="mt-3 pt-3 border-t border-route66-tan">
              <p className="text-xs text-route66-vintage-brown font-travel">
                <strong>💰 Cost Breakdown:</strong> Gas {formatCurrency(costEstimate.breakdown.gasCost)} • 
                Lodging {formatCurrency(costEstimate.breakdown.accommodationCost)} • 
                Meals {formatCurrency(costEstimate.breakdown.mealCost)}
                {costEstimate.breakdown.attractionCost > 0 && ` • Attractions ${formatCurrency(costEstimate.breakdown.attractionCost)}`}
                {costEstimate.breakdown.carRentalCost > 0 && ` • Car Rental ${formatCurrency(costEstimate.breakdown.carRentalCost)}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Daily Itinerary with Weather Information */}
      <div className="space-y-4">
        <div className="text-center p-4 bg-route66-primary rounded">
          <h3 className="text-lg font-bold text-white mb-2 font-route66">
            📅 DAILY ITINERARY WITH WEATHER
          </h3>
          <p className="text-route66-cream text-sm font-travel">
            Your complete day-by-day guide with weather forecasts
          </p>
        </div>
        
        {enrichedSegments.map((segment, index) => {
          const drivingTime = getDrivingTime(segment);
          const drivingHours = Math.floor(drivingTime);
          const drivingMinutes = Math.round((drivingTime - drivingHours) * 60);
          const drivingTimeDisplay = drivingHours > 0 ? 
            `${drivingHours}h${drivingMinutes > 0 ? ` ${drivingMinutes}m` : ''}` : 
            `${drivingMinutes}m`;

          console.log('🚗 Final driving time display for day', segment.day, ':', {
            originalTime: drivingTime,
            hours: drivingHours,
            minutes: drivingMinutes,
            display: drivingTimeDisplay
          });

          const distance = segment.distance || segment.approximateMiles || 0;

          return (
            <div key={`day-${segment.day}`} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-route66-primary bg-route66-accent-light px-2 py-1 rounded">
                    Day {segment.day}
                  </span>
                  <span className="text-gray-300">•</span>
                  <h5 className="text-sm font-semibold text-route66-text-primary">
                    {segment.startCity} → {segment.endCity}
                  </h5>
                </div>
                {tripStartDate && (
                  <span className="text-xs text-gray-500">
                    {format(new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000), 'EEE, MMM d')}
                  </span>
                )}
              </div>

              {/* Distance and Drive Time */}
              <p className="text-xs text-gray-600">
                {Math.round(distance)} miles • {drivingTimeDisplay} driving
              </p>

              {/* Weather Widget for this segment */}
              <SegmentWeatherWidget
                segment={segment}
                tripStartDate={tripStartDate}
                cardIndex={index}
                sectionKey="shared-view"
                isCollapsible={true}
              />
            </div>
          );
        })}
      </div>

      {/* Share URL section for shared view */}
      {isSharedView && shareUrl && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-700 mb-2">Share This Trip</h4>
          <p className="text-sm text-blue-600 break-all font-mono">{shareUrl}</p>
        </div>
      )}
    </div>
  );
};

export default SharedTripContentRenderer;
