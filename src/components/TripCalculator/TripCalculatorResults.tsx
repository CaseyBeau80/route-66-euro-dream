import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripCalculation } from './types/tripCalculator';
import { TripPlan } from './services/Route66TripPlannerService';
import { TripCompletionAnalysis } from './services/planning/TripCompletionService';
import { formatTime } from './utils/distanceCalculator';
import EnhancedTripResults from './EnhancedTripResults';
import ShareAndExportDropdown from './components/ShareAndExportDropdown';

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
  
  // Prioritize enhanced trip plan over legacy calculation
  if (tripPlan) {
    console.log('✨ Rendering Enhanced Trip Results with full sharing features');
    const tripTitle = `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;
    
    return (
      <div className="space-y-6">
        {/* COMPREHENSIVE SHARE & EXPORT DROPDOWN */}
        <div className="flex justify-center mb-6">
          <ShareAndExportDropdown
            shareUrl={shareUrl}
            tripTitle={tripTitle}
            tripPlan={tripPlan}
            tripStartDate={tripStartDate}
            size="lg"
            className="px-8 py-4 text-lg font-bold shadow-lg rounded-xl"
          />
        </div>

        <EnhancedTripResults 
          tripPlan={tripPlan} 
          shareUrl={shareUrl} 
          tripStartDate={tripStartDate}
          completionAnalysis={completionAnalysis}
          originalRequestedDays={originalRequestedDays}
        />

        {/* BOTTOM SHARE & EXPORT DROPDOWN */}
        <div className="flex justify-center mt-6">
          <ShareAndExportDropdown
            shareUrl={shareUrl}
            tripTitle={tripTitle}
            tripPlan={tripPlan}
            tripStartDate={tripStartDate}
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg font-bold shadow-lg rounded-xl border-2"
          />
        </div>
      </div>
    );
  }
  
  if (calculation) {
    console.log('📊 Rendering Legacy Trip Results with full sharing features');
    const tripTitle = `Route 66 Legacy Trip - ${calculation.numberOfDays} Days`;
    
    // Create a mock trip plan for legacy results to enable sharing
    const mockTripPlan: TripPlan = {
      title: tripTitle,
      startCity: 'Chicago',
      endCity: 'Los Angeles',
      totalDays: calculation.numberOfDays,
      totalDistance: calculation.totalDistance,
      totalDrivingTime: calculation.totalDriveTime,
      segments: [],
      dailySegments: []
    };
    
    return (
      <div className="space-y-6">
        {/* SHARE & EXPORT FOR LEGACY */}
        <div className="flex justify-center mb-6">
          <ShareAndExportDropdown
            shareUrl={shareUrl}
            tripTitle={tripTitle}
            tripPlan={mockTripPlan}
            tripStartDate={tripStartDate}
            size="lg"
            className="px-8 py-4 text-lg font-bold shadow-lg rounded-xl"
          />
        </div>

        <LegacyTripResults calculation={calculation} />

        {/* BOTTOM SHARE & EXPORT FOR LEGACY */}
        <div className="flex justify-center mt-6">
          <ShareAndExportDropdown
            shareUrl={shareUrl}
            tripTitle={tripTitle}
            tripPlan={mockTripPlan}
            tripStartDate={tripStartDate}
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg font-bold shadow-lg rounded-xl border-2"
          />
        </div>
      </div>
    );
  }
  
  console.log('⚠️ No trip data to display');
  return null;
};

export default TripCalculatorResults;
