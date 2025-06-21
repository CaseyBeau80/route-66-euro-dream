
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Clock, DollarSign, Route } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useCostEstimator } from '../hooks/useCostEstimator';
import { useUnits } from '@/contexts/UnitContext';
import { format, addDays } from 'date-fns';
import PreviewDailyItinerary from './PreviewDailyItinerary';
import ShareTripButton from './share/ShareTripButton';

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Enhanced Trip Overview Header */}
      <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <CardHeader className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-8">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <Route className="w-5 h-5" />
                  <span className="text-sm font-medium">Route 66 Adventure</span>
                </div>
              </div>
              
              <ShareTripButton
                tripTitle={`${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 border-white/30"
              />
            </div>
            
            <div className="text-center">
              <CardTitle className="text-3xl font-bold mb-3 text-shadow-strong">
                {tripPlan.startCity} to {tripPlan.endCity}
              </CardTitle>
              
              {tripStartDate && (
                <p className="text-blue-100 text-lg font-medium">
                  Journey begins: {format(tripStartDate, 'EEEE, MMMM d, yyyy')}
                </p>
              )}
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
        </CardContent>
      </Card>

      {/* Enhanced Daily Itinerary Section */}
      <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Route className="w-5 h-5" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Daily Itinerary
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 bg-gradient-to-b from-white to-gray-50/50">
          <div className="p-6">
            <PreviewDailyItinerary 
              segments={tripPlan.segments || []}
              tripStartDate={tripStartDate}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripResultsPreview;
