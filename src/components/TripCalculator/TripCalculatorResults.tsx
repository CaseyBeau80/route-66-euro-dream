import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripCalculation } from './types/tripCalculator';
import { TripPlan } from './services/Route66TripPlannerService';
import { formatTime } from './utils/distanceCalculator';
import EnhancedTripResults from './EnhancedTripResults';

interface TripCalculatorResultsProps {
  calculation?: TripCalculation;
  tripPlan?: TripPlan;
  shareUrl?: string | null;
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

const TripCalculatorResults: React.FC<TripCalculatorResultsProps> = ({ calculation, tripPlan, shareUrl }) => {
  console.log('🎯 TripCalculatorResults render - tripPlan:', tripPlan, 'calculation:', calculation, 'shareUrl:', shareUrl);
  
  // Prioritize enhanced trip plan over legacy calculation
  if (tripPlan) {
    console.log('✨ Rendering Enhanced Trip Results');
    return <EnhancedTripResults tripPlan={tripPlan} shareUrl={shareUrl} />;
  }
  
  if (calculation) {
    console.log('📊 Rendering Legacy Trip Results');
    return <LegacyTripResults calculation={calculation} />;
  }
  
  console.log('⚠️ No trip data to display');
  return null;
};

export default TripCalculatorResults;
