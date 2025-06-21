
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
      {/* VERY PROMINENT Share Button at the very top */}
      <div className="flex justify-center mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-xl shadow-2xl">
        <Button
          onClick={handleShare}
          variant="outline"
          size="lg"
          className="bg-white hover:bg-gray-50 text-blue-700 hover:text-blue-800 px-12 py-6 text-xl font-bold shadow-xl border-0 rounded-lg gap-3"
        >
          <Share2 className="w-6 h-6" />
          Share This Trip
        </Button>
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

          {/* Prominent Share Section */}
          <div className="mt-8 pt-6 border-t border-blue-100 text-center">
            <div className="mb-3">
              <p className="text-blue-700 font-medium mb-3">Love this trip plan?</p>
              <Button
                onClick={handleShare}
                variant="default"
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Your Trip
              </Button>
            </div>
            <p className="text-sm text-blue-600 mt-3">Share your Route 66 adventure with friends and family!</p>
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

      {/* Bottom Share Section - VERY LARGE AND PROMINENT */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-4 border-blue-300 rounded-2xl p-8 text-center shadow-xl">
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            Share Your Route 66 Adventure!
          </h3>
        </div>
        
        <p className="text-gray-700 mb-6 text-lg max-w-2xl mx-auto">
          Love this trip plan? Share it with friends and family! They'll get the complete itinerary with weather forecasts and attractions.
        </p>
        
        <Button
          onClick={handleShare}
          variant="default"
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 gap-3"
        >
          <Share2 className="w-6 h-6" />
          Share This Amazing Trip!
        </Button>
        
        <p className="text-gray-600 mt-4">
          🎯 Click above to copy your shareable trip link!
        </p>
      </div>
    </div>
  );
};

export default TripResultsPreview;
