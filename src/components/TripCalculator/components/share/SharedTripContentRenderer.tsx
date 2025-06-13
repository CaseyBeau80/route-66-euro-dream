
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { format } from 'date-fns';
import { useCostEstimator } from '../../hooks/useCostEstimator';
import SegmentWeatherWidget from '../SegmentWeatherWidget';
import WeatherErrorBoundary from '../weather/WeatherErrorBoundary';

interface SharedTripContentRendererProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string | null;
  isSharedView?: boolean;
}

const SharedTripContentRenderer: React.FC<SharedTripContentRendererProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  isSharedView = false
}) => {
  // 🔧 DEBUG: Add explicit logging to verify this component is actually rendering with latest code
  console.log('🚨 SharedTripContentRenderer: LATEST VERSION WITH RAMBLE 66 BRANDING RENDERING', {
    componentVersion: 'UPDATED_WITH_RAMBLE_66_AND_WEATHER',
    isSharedView,
    hasStartDate: !!tripStartDate,
    segmentsCount: tripPlan.segments?.length,
    tripStartCity: tripPlan.startCity,
    tripEndCity: tripPlan.endCity,
    timestamp: new Date().toISOString()
  });

  // 🔧 DEBUG: Verify this is the shared view rendering
  if (isSharedView) {
    console.log('🚨 SharedTripContentRenderer: CONFIRMED SHARED VIEW RENDERING WITH LATEST UPDATES', {
      isSharedView: true,
      hasRambleBranding: true,
      hasFourColumnLayout: true,
      hasWeatherWidgets: true,
      latestVersion: true
    });
  }

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
    const possibleTimes = [
      segment.drivingTime,
      segment.driveTimeHours
    ];
    
    for (const time of possibleTimes) {
      if (typeof time === 'number' && !isNaN(time) && time > 0) {
        return time;
      }
    }
    
    // Fallback: calculate from distance if available
    const distance = segment.distance || segment.approximateMiles;
    if (distance && typeof distance === 'number' && !isNaN(distance) && distance > 0) {
      return distance / 55; // Assume average speed of 55 mph for Route 66
    }
    
    return 0;
  };

  // Helper function to format drive time
  const formatTime = (hours?: number): string => {
    if (!hours) return 'N/A';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const segments = tripPlan.segments || [];
  const enrichedSegments = segments.filter(segment => 
    segment && segment.day && (segment.endCity || segment.destination)
  );

  // 🔧 DEBUG: Log segment rendering details
  console.log('🚨 SharedTripContentRenderer: About to render segments', {
    totalSegments: enrichedSegments.length,
    segmentCities: enrichedSegments.map(s => `Day ${s.day}: ${s.endCity}`),
    isSharedView,
    willShowWeather: true
  });

  return (
    <div className="bg-white text-black font-sans">
      {/* Header with RAMBLE 66 branding */}
      <div className="text-center mb-6 p-6 bg-gradient-to-r from-route66-primary to-route66-rust rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="bg-white rounded-full p-2">
            <div className="w-8 h-8 bg-route66-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">66</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-route66">RAMBLE 66</h1>
            <p className="text-xs text-route66-cream font-travel tracking-wider">ROUTE 66 TRIP PLANNER</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-white">
          {tripPlan.startCity} to {tripPlan.endCity} Adventure
        </h2>
        {/* 🔧 DEBUG: Visual indicator that this is the latest version */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-xs text-route66-cream bg-black bg-opacity-20 rounded px-2 py-1 inline-block">
            🚨 LATEST VERSION WITH RAMBLE 66 BRANDING
          </div>
        )}
      </div>

      {/* Trip Overview with Cost Integration */}
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
          {/* 🔧 DEBUG: Visual indicator for shared view */}
          {isSharedView && process.env.NODE_ENV === 'development' && (
            <div className="mt-1 text-xs text-route66-cream bg-black bg-opacity-20 rounded px-2 py-1 inline-block">
              🚨 SHARED VIEW WITH WEATHER WIDGETS
            </div>
          )}
        </div>
        
        {enrichedSegments.map((segment, index) => {
          const drivingTime = getDrivingTime(segment);
          const distance = segment.distance || segment.approximateMiles || 0;

          // 🔧 DEBUG: Log each segment rendering
          console.log(`🚨 SharedTripContentRenderer: Rendering Day ${segment.day} - ${segment.endCity}`, {
            segmentDay: segment.day,
            endCity: segment.endCity,
            distance,
            drivingTime,
            isSharedView,
            hasWeatherWidget: true
          });

          return (
            <div key={`day-${segment.day}`} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">Day {segment.day}</h3>
                    <p className="text-blue-100">
                      {tripStartDate && (
                        format(new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000), 'EEEE, MMMM d, yyyy')
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{segment.endCity}</p>
                    <p className="text-blue-100 text-sm">Destination</p>
                  </div>
                </div>
              </div>

              {/* Day Content */}
              <div className="p-4 space-y-4">
                {/* Stats Grid - 4 COLUMN LAYOUT */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded border">
                    <div className="text-lg font-bold text-blue-600">
                      🗺️ {Math.round(distance)}
                    </div>
                    <div className="text-xs text-gray-600">Miles</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded border">
                    <div className="text-lg font-bold text-purple-600">
                      ⏱️ {formatTime(drivingTime)}
                    </div>
                    <div className="text-xs text-gray-600">Drive Time</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded border">
                    <div className="text-sm font-medium text-gray-700">
                      🚗 From
                    </div>
                    <div className="text-xs text-gray-600">{segment.startCity}</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded border">
                    <div className="text-sm font-medium text-gray-700">
                      🏁 To
                    </div>
                    <div className="text-xs text-gray-600">{segment.endCity}</div>
                  </div>
                </div>

                {/* Weather Widget with Error Boundary */}
                <WeatherErrorBoundary 
                  segmentEndCity={segment.endCity}
                  fallbackMessage={`Weather information for ${segment.endCity} temporarily unavailable`}
                >
                  <SegmentWeatherWidget
                    segment={segment}
                    tripStartDate={tripStartDate}
                    cardIndex={index}
                    sectionKey="shared-trip-view"
                    isCollapsible={true}
                    isSharedView={isSharedView}
                    isPDFExport={false}
                  />
                </WeatherErrorBoundary>
              </div>
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

      {/* 🔧 DEBUG: Footer to confirm latest version */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-2 bg-gray-100 rounded text-center text-xs text-gray-600">
          🚨 SharedTripContentRenderer Latest Version: RAMBLE 66 + 4-Column + Weather Widgets
        </div>
      )}
    </div>
  );
};

export default SharedTripContentRenderer;
