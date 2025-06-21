
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripCalculation } from './types/tripCalculator';
import { TripPlan } from './services/Route66TripPlannerService';
import { TripCompletionAnalysis } from './services/planning/TripCompletionService';
import { formatTime } from './utils/distanceCalculator';
import EnhancedTripResults from './EnhancedTripResults';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TripCalculatorResultsProps {
  calculation?: TripCalculation;
  tripPlan?: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays?: number;
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
              {calculation.numberOfDays}
            </div>
            <div className="font-travel text-sm text-route66-vintage-brown">
              Recommended Days
            </div>
          </div>
          
          <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
            <div className="font-route66 text-2xl text-route66-vintage-red">
              {Math.round(calculation.averageDailyDistance)}
            </div>
            <div className="font-travel text-sm text-route66-vintage-brown">
              Avg Miles/Day
            </div>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="space-y-3">
          <h3 className="font-travel font-bold text-route66-vintage-brown text-lg">
            Daily Driving Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {calculation.dailyDistances.map((distance, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-route66-vintage-beige rounded border border-route66-tan"
              >
                <span className="font-travel font-bold text-route66-vintage-brown">
                  Day {index + 1}
                </span>
                <span className="font-travel text-route66-vintage-brown">
                  {Math.round(distance)} miles
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-route66-vintage-yellow rounded-lg">
          <p className="text-sm text-route66-navy font-travel text-center">
            💡 <strong>Travel Tip:</strong> Allow extra time for exploring historic attractions, 
            dining at classic diners, and taking photos at iconic landmarks along the way!
          </p>
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
  originalRequestedDays
}) => {
  console.log('🎯 TripCalculatorResults render with debug info:', {
    hasTripPlan: !!tripPlan,
    hasCalculation: !!calculation,
    shareUrl,
    tripStartDate: tripStartDate?.toISOString(),
    hasCompletionAnalysis: !!completionAnalysis,
    originalRequestedDays
  });

  // Simple share handler that works
  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      
      toast({
        title: "Trip Link Copied!",
        description: "Your Route 66 trip link has been copied to the clipboard. Share it with friends and family!",
        variant: "default"
      });
    } catch (error) {
      console.error('Share failed:', error);
      toast({
        title: "Share Failed",
        description: "Could not copy link. Please copy the URL manually from your browser.",
        variant: "destructive"
      });
    }
  };
  
  // Prioritize enhanced trip plan over legacy calculation
  if (tripPlan) {
    console.log('✨ Rendering Enhanced Trip Results with share button');
    return (
      <div className="space-y-6">
        {/* PROMINENT SHARE BUTTON */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={handleShare}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold shadow-lg rounded-xl gap-3"
          >
            <Share2 className="w-5 h-5" />
            Share This Trip
          </Button>
        </div>

        <EnhancedTripResults 
          tripPlan={tripPlan} 
          shareUrl={shareUrl} 
          tripStartDate={tripStartDate}
          completionAnalysis={completionAnalysis}
          originalRequestedDays={originalRequestedDays}
        />

        {/* BOTTOM SHARE BUTTON */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleShare}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-bold shadow-lg rounded-xl gap-3"
          >
            <Share2 className="w-5 h-5" />
            Share Your Adventure
          </Button>
        </div>
      </div>
    );
  }
  
  if (calculation) {
    console.log('📊 Rendering Legacy Trip Results with share button');
    return (
      <div className="space-y-6">
        {/* SHARE BUTTON FOR LEGACY */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={handleShare}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold shadow-lg rounded-xl gap-3"
          >
            <Share2 className="w-5 h-5" />
            Share This Trip
          </Button>
        </div>

        <LegacyTripResults calculation={calculation} />

        {/* BOTTOM SHARE BUTTON FOR LEGACY */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleShare}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-bold shadow-lg rounded-xl gap-3"
          >
            <Share2 className="w-5 h-5" />
            Share Your Adventure
          </Button>
        </div>
      </div>
    );
  }
  
  console.log('⚠️ No trip data to display');
  return null;
};

export default TripCalculatorResults;
