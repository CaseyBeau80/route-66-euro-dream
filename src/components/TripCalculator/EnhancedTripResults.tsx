import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { TripPlan } from './services/Route66TripPlannerService';
import { TripCompletionAnalysis } from './services/planning/TripCompletionService';
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
  const formatDate = (date: Date | undefined): string => {
    return date ? format(date, 'MMMM dd, yyyy') : 'Not specified';
  };

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
                  {tripPlan.summary.startLocation}
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
                  {tripPlan.summary.endLocation}
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
                  {Math.round(tripPlan.totalDistance)} Miles
                </div>
                <div className="text-sm text-route66-vintage-brown">
                  {tripPlan.totalDriveTime.toFixed(1)} hours
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Analysis Card */}
      {completionAnalysis && (
        <TripCompletionCard 
          analysis={completionAnalysis} 
          originalRequestedDays={originalRequestedDays}
        />
      )}

      {/* Daily Itinerary */}
      <div>
        <h3 className="text-2xl font-bold text-route66-vintage-brown mb-6 text-center">
          Your Route 66 Adventure
        </h3>
        <PreviewDailyItinerary 
          segments={tripPlan.segments} 
          tripStartDate={tripStartDate}
        />
      </div>

      {/* Shareable URL */}
      {shareUrl && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Share your trip: <a href={shareUrl} className="text-blue-500">{shareUrl}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedTripResults;
