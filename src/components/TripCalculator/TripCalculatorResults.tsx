
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripCalculation } from './types/tripCalculator';
import { TripPlan } from './services/Route66TripPlannerService';
import { TripCompletionAnalysis } from './services/planning/TripCompletionService';
import { formatTime } from './utils/distanceCalculator';
import EnhancedTripResults from './EnhancedTripResults';
import ShareTripButton from './components/ShareTripButton';

interface TripCalculatorResultsProps {
  calculation?: TripCalculation;
  tripPlan?: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays?: number;
  onDateRequired?: () => void;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
}

const LegacyTripResults: React.FC<{ calculation: TripCalculation }> = ({ calculation }) => {
  console.log('📊 Rendering Legacy Trip Results:', calculation);
  
  return (
    <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
      <CardHeader className="bg-gradient-to-r from-route66-orange to-route66-vintage-yellow text-white">
        <CardTitle className="font-route66 text-xl text-center">
          LEGACY ROUTE 66 ADVENTURE
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
            <div className="font-route66 text-2xl text-route66-vintage-red">
              {Math.round(calculation.totalDistance)}
            </div>
            <div className="font-travel text-sm text-route66-vintage-brown">
              Total Miles
            </div>
          </div>
          
          <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
            <div className="font-route66 text-2xl text-route66-vintage-red">
              {formatTime(calculation.totalDriveTime)}
            </div>
            <div className="font-travel text-xs text-route66-vintage-brown mb-1">
              Drive Time
            </div>
            <div className="font-travel text-xs text-route66-vintage-brown opacity-75">
              ({calculation.totalDriveTime.toFixed(1)} hours)
            </div>
          </div>
          
          <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
            <div className="font-route66 text-2xl text-route66-vintage-red">
              {calculation.estimatedDays}
            </div>
            <div className="font-travel text-sm text-route66-vintage-brown">
              Estimated Days
            </div>
          </div>
          
          <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
            <div className="font-route66 text-2xl text-route66-vintage-red">
              ${Math.round(calculation.estimatedCost)}
            </div>
            <div className="font-travel text-sm text-route66-vintage-brown">
              Est. Total Cost
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TripCalculatorResults: React.FC<TripCalculatorResultsProps> = ({
  calculation,
  tripPlan,
  shareUrl,
  tripStartDate,
  completionAnalysis,
  originalRequestedDays,
  onDateRequired,
  onShareUrlGenerated
}) => {
  console.log('📊 TripCalculatorResults render:', {
    hasCalculation: !!calculation,
    hasTripPlan: !!tripPlan,
    hasShareUrl: !!shareUrl,
    hasTripStartDate: !!tripStartDate,
    hasCompletionAnalysis: !!completionAnalysis
  });

  // If we have a modern trip plan, show enhanced results
  if (tripPlan) {
    return (
      <div className="space-y-6">
        <EnhancedTripResults
          tripPlan={tripPlan}
          shareUrl={shareUrl}
          tripStartDate={tripStartDate}
          completionAnalysis={completionAnalysis}
          originalRequestedDays={originalRequestedDays}
          onDateRequired={onDateRequired}
        />
        
        {/* Share Button Section */}
        <div className="flex justify-center pt-4">
          <ShareTripButton
            tripPlan={tripPlan}
            tripStartDate={tripStartDate}
            shareUrl={shareUrl}
            onShareUrlGenerated={onShareUrlGenerated}
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Share Your Route 66 Adventure
          </ShareTripButton>
        </div>
      </div>
    );
  }

  // Fallback to legacy results for older calculation format
  if (calculation) {
    return <LegacyTripResults calculation={calculation} />;
  }

  return null;
};

export default TripCalculatorResults;
