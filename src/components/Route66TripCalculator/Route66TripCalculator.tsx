
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Clock, Route } from 'lucide-react';
import TripCalculatorForm from '../TripCalculator/TripCalculatorForm';
import EnhancedTripResults from '../TripCalculator/EnhancedTripResults';
import ItineraryPreLoader from '../TripCalculator/components/ItineraryPreLoader';
import { useEnhancedTripCalculation } from '../TripCalculator/hooks/useEnhancedTripCalculation';

const Route66TripCalculator: React.FC = () => {
  const {
    formData,
    setFormData,
    tripPlan,
    shareUrl,
    availableEndLocations,
    calculateTrip,
    resetTrip,
    isCalculating,
    isCalculateDisabled,
    loadingState
  } = useEnhancedTripCalculation();

  console.log('🚗 Route66TripCalculator: Rendering with enhanced loading state', {
    hasTripPlan: !!tripPlan,
    isCalculating,
    isPreLoading: loadingState.isPreLoading,
    loadingProgress: loadingState.progress
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
            <Route className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Route 66 Trip Calculator</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Plan your perfect journey along America's Mother Road. Get detailed itineraries, 
          weather forecasts, and cost estimates for your Route 66 adventure.
        </p>
      </div>

      {/* Trip Planning Form */}
      <Card className="bg-white shadow-lg border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-orange-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
            <MapPin className="h-5 w-5 text-blue-600" />
            Plan Your Route 66 Adventure
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <TripCalculatorForm
            formData={formData}
            setFormData={setFormData}
            availableEndLocations={availableEndLocations}
            onCalculate={calculateTrip}
            isCalculateDisabled={isCalculateDisabled}
            isCalculating={isCalculating}
            tripPlan={tripPlan}
            shareUrl={shareUrl}
          />
        </CardContent>
      </Card>

      {/* Show Pre-loader when loading but no trip plan yet */}
      {loadingState.isPreLoading && !tripPlan && (
        <div className="w-full max-w-6xl mx-auto">
          <ItineraryPreLoader
            progress={loadingState.progress}
            currentStep={loadingState.currentStep}
            totalSegments={loadingState.totalSegments}
            loadedSegments={loadingState.loadedSegments}
          />
        </div>
      )}

      {/* Trip Results - Only render when we have a valid trip plan */}
      {tripPlan && (
        <EnhancedTripResults
          tripPlan={tripPlan}
          shareUrl={shareUrl}
          tripStartDate={formData.tripStartDate}
          loadingState={loadingState}
        />
      )}

      {/* Features Overview */}
      {!tripPlan && !loadingState.isPreLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="text-center p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Itineraries</h3>
            <p className="text-gray-600">Get day-by-day travel plans optimized for your schedule and preferences.</p>
          </Card>
          
          <Card className="text-center p-6 border-2 border-gray-200 hover:border-orange-300 transition-colors">
            <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Weather Forecasts</h3>
            <p className="text-gray-600">Plan with confidence using detailed weather information for each destination.</p>
          </Card>
          
          <Card className="text-center p-6 border-2 border-gray-200 hover:border-green-300 transition-colors">
            <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Historic Attractions</h3>
            <p className="text-gray-600">Discover must-see stops, hidden gems, and authentic Route 66 experiences.</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Route66TripCalculator;
