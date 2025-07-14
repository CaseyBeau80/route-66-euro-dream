
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { TripPlan } from './services/planning/TripPlanBuilder';
import { TripCompletionAnalysis } from './services/planning/TripCompletionService';
import { DataStandardizationService } from '@/services/DataStandardizationService';
import { useUnits } from '@/contexts/UnitContext';
import PreviewDailyItinerary from './components/PreviewDailyItinerary';
import TripCompletionCard from './components/TripCompletionCard';
import TripPlanningDebugPanel from './components/TripPlanningDebugPanel';

interface EnhancedTripResultsProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays?: number;
  debugInfo?: any;
  validationResults?: any;
  warnings?: string[];
}

const EnhancedTripResults: React.FC<EnhancedTripResultsProps> = ({ 
  tripPlan, 
  shareUrl, 
  tripStartDate,
  completionAnalysis,
  originalRequestedDays,
  debugInfo,
  validationResults,
  warnings = []
}) => {
  const { preferences } = useUnits();

  const formatDate = (date: Date | undefined): string => {
    return date ? format(date, 'MMMM dd, yyyy') : 'Not specified';
  };

  // Standardize trip summary data
  const standardizedSummary = React.useMemo(() => {
    const totalDistance = tripPlan.totalDistance || tripPlan.totalMiles || 0;
    const totalDriveTime = tripPlan.totalDrivingTime || tripPlan.summary?.totalDriveTime || 0;
    
    return {
      distance: DataStandardizationService.standardizeDistance(totalDistance, preferences),
      driveTime: DataStandardizationService.standardizeDriveTime(totalDriveTime),
      startLocation: tripPlan.summary?.startLocation || tripPlan.startLocation || 'Start Location',
      endLocation: tripPlan.summary?.endLocation || tripPlan.endLocation || 'End Location'
    };
    
    // CRITICAL DEBUG: Log what we're actually displaying
    console.log(`🚨 [DISPLAY DEBUG] standardizedSummary created:`, {
      startLocation: tripPlan.summary?.startLocation || tripPlan.startLocation || 'Start Location',
      endLocation: tripPlan.summary?.endLocation || tripPlan.endLocation || 'End Location',
      'tripPlan.summary?.endLocation': tripPlan.summary?.endLocation,
      'tripPlan.endLocation': tripPlan.endLocation,
      'final endLocation used': tripPlan.summary?.endLocation || tripPlan.endLocation || 'End Location'
    });
  }, [tripPlan, preferences]);

  console.log('📊 STANDARDIZED: EnhancedTripResults using unified formatting:', {
    originalData: {
      totalDistance: tripPlan.totalDistance,
      totalMiles: tripPlan.totalMiles,
      totalDrivingTime: tripPlan.totalDrivingTime
    },
    standardizedSummary,
    preferences: preferences.distance
  });

  // CRITICAL DEBUG: Log the EXACT tripPlan object being passed in
  console.log('🚨 [FINAL RESULTS DEBUG] ENTIRE tripPlan object:', tripPlan);
  console.log('🚨 [FINAL RESULTS DEBUG] tripPlan.endCity:', tripPlan.endCity);
  console.log('🚨 [FINAL RESULTS DEBUG] tripPlan.endLocation:', tripPlan.endLocation);
  console.log('🚨 [FINAL RESULTS DEBUG] tripPlan.summary:', tripPlan.summary);
  console.log('🚨 [FINAL RESULTS DEBUG] standardizedSummary.endLocation:', standardizedSummary.endLocation);

  return (
    <div className="space-y-6">
      {/* Debug Panel - Show if there are warnings or validation issues */}
      {(warnings.length > 0 || !validationResults?.driveTimeValidation?.isValid || !validationResults?.sequenceValidation?.isValid) && (
        <TripPlanningDebugPanel
          debugInfo={debugInfo}
          validationResults={validationResults}
          warnings={warnings}
          isVisible={warnings.length > 0}
        />
      )}

      {/* Trip Summary Card */}
      <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
        <CardHeader className="bg-gradient-to-r from-route66-orange to-route66-vintage-yellow text-white">
          <CardTitle className="font-route66 text-2xl text-center">
            ROUTE 66 ADVENTURE
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Start & End Locations */}
            <div className="flex items-center gap-3 p-4 bg-route66-cream rounded-lg border border-route66-tan">
              <MapPin className="w-5 h-5 text-route66-navy" />
              <div>
                <div className="font-bold text-route66-vintage-brown">
                  {standardizedSummary.startLocation}
                </div>
                <div className="text-sm text-route66-vintage-brown">
                  Start Location
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-route66-cream rounded-lg border border-route66-tan">
              <MapPin className="w-5 h-5 text-route66-navy" />
              <div>
                <div className="font-bold text-route66-vintage-brown">
                  {standardizedSummary.endLocation}
                </div>
                <div className="text-sm text-route66-vintage-brown">
                  End Location
                </div>
              </div>
            </div>

            {/* Total Days & Distance */}
            <div className="flex items-center gap-3 p-4 bg-route66-cream rounded-lg border border-route66-tan">
              <CalendarDays className="w-5 h-5 text-route66-navy" />
              <div>
                <div className="font-bold text-route66-vintage-brown">
                  {tripPlan.totalDays} Days
                </div>
                <div className="text-sm text-route66-vintage-brown">
                  {formatDate(tripStartDate)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-route66-cream rounded-lg border border-route66-tan">
              <Clock className="w-5 h-5 text-route66-navy" />
              <div>
                <div className="font-bold text-route66-vintage-brown">
                  {standardizedSummary.distance.formatted}
                </div>
                <div className="text-sm text-route66-vintage-brown">
                  {standardizedSummary.driveTime.formatted} total driving
                </div>
              </div>
            </div>
          </div>

          {/* Trip Completion Analysis */}
          {completionAnalysis && (
            <TripCompletionCard 
              analysis={completionAnalysis} 
              originalRequestedDays={originalRequestedDays}
            />
          )}

          {/* Trip Style Badge */}
          {tripPlan.tripStyle && (
            <div className="mt-4 text-center">
              <span className="inline-block bg-route66-vintage-yellow text-route66-navy px-4 py-2 rounded-full font-travel font-bold text-sm">
                {tripPlan.tripStyle === 'destination-focused' ? '🏛️ Heritage & Destinations' : '🛣️ Balanced Experience'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
        <CardHeader className="bg-gradient-to-r from-route66-vintage-red to-route66-vintage-brown text-white">
          <CardTitle className="font-route66 text-xl text-center">
            DAILY ITINERARY
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <PreviewDailyItinerary 
            segments={tripPlan.segments || tripPlan.dailySegments || []} 
            tripStartDate={tripStartDate}
          />
        </CardContent>
      </Card>

      {/* Share Section */}
      {shareUrl && (
        <Card className="border-2 border-green-500">
          <CardHeader className="bg-green-500 text-white">
            <CardTitle className="text-lg text-center">
              🔗 Share Your Trip
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="bg-gray-100 p-3 rounded border">
              <p className="text-sm text-gray-600 mb-2">Share this link:</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="flex-1 p-2 border rounded text-sm bg-white"
                />
                <button 
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Copy
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedTripResults;
