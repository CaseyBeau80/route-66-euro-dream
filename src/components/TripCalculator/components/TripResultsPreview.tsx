import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Clock, DollarSign, Route, Share2 } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useCostEstimator } from '../hooks/useCostEstimator';
import { useUnits } from '@/contexts/UnitContext';
import { format, addDays } from 'date-fns';
import PreviewDailyItinerary from './PreviewDailyItinerary';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface TripResultsPreviewProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const TripResultsPreview: React.FC<TripResultsPreviewProps> = ({
  tripPlan,
  tripStartDate
}) => {
  const { formatDistance } = useUnits();
  const { costEstimate } = useCostEstimator(tripPlan);

  // Ensure we have a valid trip start date
  const validTripStartDate = React.useMemo(() => {
    if (tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())) {
      return tripStartDate;
    }
    // Default to today if no valid date provided
    return new Date();
  }, [tripStartDate]);

  console.log('🎯 TripResultsPreview: Rendering with valid start date:', {
    originalDate: tripStartDate?.toISOString(),
    validDate: validTripStartDate.toISOString(),
    hasTripPlan: !!tripPlan
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Simple share handler
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

  // Build trip title for sharing
  const startCity = tripPlan.startCity || tripPlan.segments?.[0]?.startCity || 'Route 66';
  const endCity = tripPlan.endCity || tripPlan.segments?.[tripPlan.segments?.length - 1]?.endCity || 'Adventure';
  const tripTitle = `${startCity} to ${endCity} Route 66 Trip`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* MASSIVE Share Button at the very top - This should be impossible to miss */}
      <div className="w-full bg-gradient-to-r from-red-500 via-blue-500 to-green-500 p-2 rounded-2xl shadow-2xl">
        <div className="bg-white rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 SHARE YOUR TRIP 🎯</h2>
          <Button
            onClick={handleShare}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-16 py-8 text-2xl font-bold shadow-xl rounded-xl gap-4 transform hover:scale-105 transition-all duration-300"
          >
            <Share2 className="w-8 h-8" />
            SHARE THIS TRIP NOW!
          </Button>
          <p className="text-gray-600 mt-4 text-lg">Click above to copy your shareable trip link!</p>
        </div>
      </div>

      {/* Enhanced Trip Overview Header */}
      <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <CardHeader className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <Route className="w-5 h-5" />
                  <span className="text-sm font-medium">Route 66 Adventure</span>
                </div>
              </div>
              
              {/* Share Button in Header */}
              <Button
                onClick={handleShare}
                variant="outline"
                size="default"
                className="text-white hover:bg-white/20 border-2 border-white/30 bg-white/10 gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Trip
              </Button>
            </div>
            
            <div className="text-center">
              <CardTitle className="text-3xl font-bold mb-3 text-shadow-strong">
                {startCity} to {endCity}
              </CardTitle>
              
              <p className="text-blue-100 text-lg font-medium">
                Journey begins: {format(validTripStartDate, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Enhanced Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative text-center p-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-700 mb-1">{tripPlan.totalDays}</div>
                <div className="text-sm font-medium text-blue-600">Days</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative text-center p-6 rounded-2xl border border-green-100 bg-gradient-to-br from-white to-green-50/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-green-700 mb-1">
                  {Math.round(tripPlan.totalDistance)}
                </div>
                <div className="text-sm font-medium text-green-600">Miles</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative text-center p-6 rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-orange-700 mb-1">
                  {Math.round((tripPlan.totalDistance || 0) / 55)}
                </div>
                <div className="text-sm font-medium text-orange-600">Drive Hours</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative text-center p-6 rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-1">
                  {costEstimate ? formatCurrency(costEstimate.breakdown.totalCost) : '$1,615'}
                </div>
                <div className="text-sm font-medium text-purple-600">Est. Cost</div>
              </div>
            </div>
          </div>

          {/* ANOTHER Prominent Share Section */}
          <div className="mt-8 pt-6 border-t border-blue-100 text-center bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
            <div className="mb-3">
              <p className="text-blue-700 font-bold text-xl mb-4">💫 LOVE THIS TRIP PLAN? 💫</p>
              <Button
                onClick={handleShare}
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold shadow-lg hover:shadow-xl gap-3 transform hover:scale-105 transition-all duration-300"
              >
                <Share2 className="w-6 h-6" />
                SHARE YOUR ADVENTURE!
              </Button>
            </div>
            <p className="text-lg text-blue-700 font-medium mt-4">Share your Route 66 adventure with friends and family!</p>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Daily Itinerary Section */}
      <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Route className="w-5 h-5" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Daily Itinerary
              </CardTitle>
            </div>
            
            {/* Share Button in Itinerary Header */}
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="text-white hover:bg-white/20 border border-white/30 gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Trip
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 bg-gradient-to-b from-white to-gray-50/50">
          <div className="p-6">
            <PreviewDailyItinerary 
              segments={tripPlan.segments || []}
              tripStartDate={validTripStartDate}
            />
          </div>
        </CardContent>
      </Card>

      {/* FINAL Bottom Share Section - ULTRA PROMINENT */}
      <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-green-100 border-8 border-blue-400 rounded-3xl p-12 text-center shadow-2xl">
        <div className="flex justify-center items-center gap-6 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-4xl font-black text-gray-800">
            🚗 SHARE YOUR ROUTE 66 ADVENTURE! 🚗
          </h3>
        </div>
        
        <p className="text-gray-800 mb-8 text-2xl font-bold max-w-3xl mx-auto">
          Love this trip plan? Share it with friends and family! They'll get the complete itinerary with weather forecasts and attractions.
        </p>
        
        <Button
          onClick={handleShare}
          variant="default"
          size="lg"
          className="bg-gradient-to-r from-red-600 via-blue-600 to-green-600 hover:from-red-700 hover:via-blue-700 hover:to-green-700 text-white px-20 py-10 rounded-2xl font-black text-3xl shadow-2xl hover:shadow-3xl transform hover:scale-110 gap-4 transition-all duration-500"
        >
          <Share2 className="w-10 h-10" />
          🎯 SHARE THIS AMAZING TRIP! 🎯
        </Button>
        
        <p className="text-gray-700 mt-6 text-xl font-bold">
          👆 Click above to copy your shareable trip link! 👆
        </p>
      </div>
    </div>
  );
};

export default TripResultsPreview;
