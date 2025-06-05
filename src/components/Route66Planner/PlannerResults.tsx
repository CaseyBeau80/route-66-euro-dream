
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripItinerary } from './types';
import { MapPin, Clock, Route, Share2, Calendar, Info } from 'lucide-react';
import { GoogleDistanceMatrixService } from './services/GoogleDistanceMatrixService';

interface PlannerResultsProps {
  itinerary: TripItinerary | null;
  isPlanning: boolean;
}

const PlannerResults: React.FC<PlannerResultsProps> = ({ itinerary, isPlanning }) => {
  const shareItinerary = () => {
    if (itinerary) {
      const shareText = `Check out my Route 66 itinerary: ${itinerary.totalDays} days, ${itinerary.totalDistance} miles along the historic Mother Road!`;
      navigator.share?.({ 
        title: 'My Route 66 Trip', 
        text: shareText,
        url: window.location.href 
      }) || navigator.clipboard.writeText(shareText);
    }
  };

  if (isPlanning) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
          <p className="text-[#64748b]">Planning your Route 66 adventure...</p>
          <p className="text-xs text-[#94a3b8] mt-2">Calculating accurate distances along the Mother Road</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
          <p className="text-[#64748b]">Your Route 66 itinerary will appear here</p>
          <p className="text-xs text-[#94a3b8] mt-2">Select your start and end cities to begin planning</p>
        </div>
      </div>
    );
  }

  const isUsingGoogleData = GoogleDistanceMatrixService.isAvailable();

  return (
    <div className="space-y-6">
      {/* Trip Summary */}
      <Card className="border-[#e2e8f0]">
        <CardHeader className="bg-[#3b82f6] text-white">
          <CardTitle className="flex items-center justify-between">
            <span>Your Route 66 Adventure</span>
            <Button
              onClick={shareItinerary}
              variant="secondary"
              size="sm"
              className="bg-white text-[#3b82f6] hover:bg-[#f1f5f9]"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-[#3b82f6]">{itinerary.totalDays}</div>
              <div className="text-sm text-[#64748b]">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#3b82f6]">{itinerary.totalDistance}</div>
              <div className="text-sm text-[#64748b]">Miles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#3b82f6]">{itinerary.totalDrivingTime}</div>
              <div className="text-sm text-[#64748b]">Drive Time</div>
            </div>
          </div>
          
          {/* Data Source Indicator */}
          <div className={`flex items-center gap-2 p-2 rounded text-xs ${
            isUsingGoogleData 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <Info className="w-3 h-3" />
            {isUsingGoogleData ? (
              <span>✅ Distances calculated using Google Maps for accuracy</span>
            ) : (
              <span>📏 Using estimated distances - add Google Maps API key for precise calculations</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#3b82f6]" />
          Daily Itinerary
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {itinerary.dailySegments.map((segment) => (
            <Card key={segment.day} className="border-[#e2e8f0] hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-[#1e293b]">
                      Day {segment.day}: {segment.startCity.name} → {segment.endCity.name}
                    </h4>
                    <p className="text-sm text-[#64748b]">{segment.date}</p>
                    <p className="text-xs text-[#94a3b8]">
                      {segment.startCity.state} to {segment.endCity.state}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1 text-[#3b82f6]">
                      <Route className="w-4 h-4" />
                      {segment.distance} miles
                    </div>
                    <div className="flex items-center gap-1 text-[#64748b]">
                      <Clock className="w-4 h-4" />
                      {segment.drivingTime}
                    </div>
                  </div>
                </div>
                
                {segment.attractions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-[#1e293b] mb-1">Attractions:</p>
                    <div className="space-y-1">
                      {segment.attractions.slice(0, 2).map((attraction) => (
                        <p key={attraction.id} className="text-sm text-[#64748b]">
                          • {attraction.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                {segment.funFact && (
                  <div className="mt-2 p-2 bg-[#f1f5f9] rounded text-sm text-[#1e293b]">
                    💡 {segment.funFact}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Route 66 Disclaimer */}
      <Card className="border-[#e2e8f0] bg-gradient-to-r from-[#f1f5f9] to-white">
        <CardContent className="p-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-[#1e293b] mb-2">About This Route</h4>
            <p className="text-sm text-[#64748b]">
              🛣️ This itinerary follows the historic Route 66 path through destination cities, 
              not modern interstate highways. Actual driving times may vary based on traffic, 
              road conditions, and time spent at attractions.
            </p>
            <p className="text-xs text-[#3b82f6] mt-2">
              📍 Celebrating the Mother Road's legacy - November 11, 2026 marks Route 66's centennial!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlannerResults;
