
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripCalculation } from './types/tripCalculator';
import { TripPlan } from './services/planning/TripPlanTypes';
import { TripCompletionAnalysis } from './services/planning/TripCompletionService';
import { formatTime } from './utils/distanceCalculator';
import EnhancedTripResults from './EnhancedTripResults';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

interface TripCalculatorResultsProps {
  calculation?: TripCalculation;
  tripPlan?: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays?: number;
  onDateRequired?: () => void;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
  onShareTrip?: () => void;
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
  onShareUrlGenerated,
  onShareTrip
}) => {
  console.log('📊 TripCalculatorResults render:', {
    hasCalculation: !!calculation,
    hasTripPlan: !!tripPlan,
    hasShareUrl: !!shareUrl,
    hasTripStartDate: !!tripStartDate,
    hasCompletionAnalysis: !!completionAnalysis,
    hasOnShareTrip: !!onShareTrip
  });

  // If we have a modern trip plan, show enhanced results
  if (tripPlan) {
    return (
      <div className="space-y-6">
        {/* GIANT Share Button at the very top */}
        {onShareTrip && (
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-2xl shadow-2xl">
              <Button
                onClick={onShareTrip}
                size="lg"
                className="bg-white hover:bg-gray-50 text-blue-700 hover:text-blue-800 px-16 py-8 text-2xl font-bold shadow-xl border-0 rounded-xl flex items-center gap-4"
              >
                <Share2 className="h-8 w-8" />
                🎯 SHARE YOUR ROUTE 66 TRIP! 🎯
              </Button>
            </div>
          </div>
        )}

        <EnhancedTripResults
          tripPlan={tripPlan}
          shareUrl={shareUrl}
          tripStartDate={tripStartDate}
          completionAnalysis={completionAnalysis}
          originalRequestedDays={originalRequestedDays}
          onDateRequired={onDateRequired}
        />
        
        {/* Another Big Share Button at the bottom */}
        {onShareTrip && (
          <div className="flex justify-center pt-8">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-2xl shadow-2xl">
              <Button
                onClick={onShareTrip}
                size="lg"
                className="bg-white hover:bg-gray-50 text-green-700 hover:text-green-800 px-12 py-6 text-xl font-bold shadow-xl border-0 rounded-xl flex items-center gap-3"
              >
                <Share2 className="h-6 w-6" />
                Share This Amazing Trip!
              </Button>
            </div>
          </div>
        )}
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
