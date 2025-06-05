import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripPlan } from './services/planning/TripPlanBuilder';
import { MapPin, Clock, Calendar, Users, Share2, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import SegmentWeatherWidget from './components/SegmentWeatherWidget';
import CostEstimatorForm from './components/CostEstimatorForm';
import CostBreakdownDisplay from './components/CostBreakdownDisplay';
import { useCostEstimator } from './hooks/useCostEstimator';

interface EnhancedTripResultsProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
}

const EnhancedTripResults: React.FC<EnhancedTripResultsProps> = ({ 
  tripPlan, 
  shareUrl, 
  tripStartDate 
}) => {
  const [showCostEstimator, setShowCostEstimator] = useState(false);
  const { costData, setCostData, costEstimate } = useCostEstimator(tripPlan);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleShare = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        console.log('📋 Trip URL copied to clipboard');
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Trip Overview Card */}
      <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
        <CardHeader className="bg-gradient-to-r from-route66-orange to-route66-vintage-yellow text-white">
          <CardTitle className="font-route66 text-xl text-center flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6" />
            YOUR ROUTE 66 ADVENTURE
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
              <div className="font-route66 text-2xl text-route66-vintage-red">
                {Math.round(tripPlan.totalDistance)}
              </div>
              <div className="font-travel text-sm text-route66-vintage-brown">Total Miles</div>
            </div>
            
            <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
              <div className="font-route66 text-2xl text-route66-vintage-red">
                {formatTime(tripPlan.totalDrivingTime)}
              </div>
              <div className="font-travel text-sm text-route66-vintage-brown">Drive Time</div>
            </div>
            
            <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
              <div className="font-route66 text-2xl text-route66-vintage-red">
                {tripPlan.segments.length}
              </div>
              <div className="font-travel text-sm text-route66-vintage-brown">Days</div>
            </div>
            
            <div className="text-center p-4 bg-route66-cream rounded-lg border border-route66-tan">
              <div className="font-route66 text-2xl text-route66-vintage-red">
                {costEstimate ? formatCurrency(costEstimate.breakdown.totalCost) : '--'}
              </div>
              <div className="font-travel text-sm text-route66-vintage-brown">Est. Total Cost</div>
            </div>
          </div>

          {/* Cost Estimator Toggle */}
          <div className="mb-6">
            <Button
              onClick={() => setShowCostEstimator(!showCostEstimator)}
              variant="outline"
              className="w-full border-green-300 text-green-700 hover:bg-green-50"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              {showCostEstimator ? 'Hide' : 'Show'} Cost Estimator
              {showCostEstimator ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {/* Route Summary */}
          <div className="text-center mb-6">
            <h3 className="font-travel font-bold text-route66-vintage-brown text-lg mb-2">
              Your Journey: {tripPlan.startCity} → {tripPlan.endCity}
            </h3>
            <div className="flex justify-center items-center gap-4 text-sm text-route66-vintage-brown">
              {tripStartDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Starts {formatDate(tripStartDate)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(tripPlan.totalDrivingTime)} driving</span>
              </div>
            </div>
          </div>

          {shareUrl && (
            <div className="text-center">
              <Button 
                onClick={handleShare}
                className="bg-route66-vintage-brown hover:bg-route66-vintage-brown/90 text-white"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Trip Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cost Estimator Section */}
      {showCostEstimator && (
        <div className="space-y-6">
          <CostEstimatorForm 
            costData={costData}
            setCostData={setCostData}
          />
          
          {costEstimate && (
            <CostBreakdownDisplay 
              costEstimate={costEstimate}
              groupSize={costData.groupSize}
            />
          )}
        </div>
      )}

      {/* Daily Itinerary */}
      <Card>
        <CardHeader>
          <CardTitle className="font-travel text-route66-vintage-brown">
            Daily Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="itinerary">Route & Stops</TabsTrigger>
              <TabsTrigger value="weather">Weather Forecast</TabsTrigger>
            </TabsList>
            
            <TabsContent value="itinerary" className="space-y-4 mt-6">
              {tripPlan.segments.map((segment, index) => (
                <div key={segment.day} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-bold">
                        Day {segment.day}
                      </Badge>
                      <div>
                        <div className="font-semibold">{segment.startCity} → {segment.endCity}</div>
                        <div className="text-sm text-gray-600">
                          {Math.round(segment.distance)} miles • {formatTime(segment.drivingTime)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {segment.attractions && segment.attractions.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Recommended Stops:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {segment.attractions.map((attraction, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {attraction}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="weather" className="space-y-4 mt-6">
              {tripPlan.segments.map((segment) => (
                <SegmentWeatherWidget
                  key={segment.day}
                  segment={segment}
                  tripStartDate={tripStartDate}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedTripResults;
