
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripCalculation } from './types/tripCalculator';
import { formatTime } from './utils/distanceCalculator';
import { ExternalLink } from 'lucide-react';

interface TripCalculatorResultsProps {
  calculation: TripCalculation;
}

const TripCalculatorResults: React.FC<TripCalculatorResultsProps> = ({ calculation }) => {
  return (
    <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
      <CardHeader className="bg-gradient-to-r from-route66-orange to-route66-vintage-yellow text-white">
        <CardTitle className="font-route66 text-xl text-center">
          YOUR ROUTE 66 ADVENTURE
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

        {/* Google Gemini AI Assistant */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-travel font-bold text-blue-900 mb-2">
                🤖 Get AI-Powered Trip Advice
              </h4>
              <p className="text-sm text-blue-800 font-travel">
                Chat with Google Gemini for personalized Route 66 recommendations, hidden gems, and travel tips!
              </p>
            </div>
            <a
              href="https://g.co/gemini/share/aded98924f33"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-travel font-bold transition-colors duration-200"
            >
              Chat with Gemini
              <ExternalLink className="w-4 h-4" />
            </a>
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

export default TripCalculatorResults;
