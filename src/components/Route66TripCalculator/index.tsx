
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TripFormData } from '../TripCalculator/types/tripCalculator';
import { toast } from '@/hooks/use-toast';
import { useTripCalculation } from './hooks/useTripCalculation';
import TripCalculatorForm from '../TripCalculator/components/TripCalculatorForm';
import TripCalculatorResults from '../TripCalculator/TripCalculatorResults';
import GoogleMapsApiInput from '../TripCalculator/components/GoogleMapsApiInput';
import DistanceCalculationProgress from '../TripCalculator/components/DistanceCalculationProgress';
import { GoogleMapsIntegrationService } from '../TripCalculator/services/GoogleMapsIntegrationService';

const Route66TripCalculator: React.FC = () => {
  const { tripPlan, isCalculating, planningResult, calculateTrip, resetTrip } = useTripCalculation();
  const [hasGoogleMapsApi, setHasGoogleMapsApi] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState({
    isVisible: false,
    current: 0,
    total: 0,
    currentSegment: '',
    accuracy: 'estimated'
  });

  useEffect(() => {
    // Check if Google Maps API is already configured
    setHasGoogleMapsApi(GoogleMapsIntegrationService.isAvailable());
  }, []);

  const handleApiKeySet = useCallback((hasKey: boolean) => {
    setHasGoogleMapsApi(hasKey);
    if (hasKey) {
      console.log('🗺️ Google Maps API connected - enhanced accuracy enabled');
    } else {
      console.log('📐 Google Maps API disconnected - using estimated calculations');
    }
  }, []);

  const handleCalculateTrip = useCallback(async (formData: TripFormData) => {
    console.log('🚗 Starting enhanced trip calculation with Google Maps integration:', {
      hasGoogleMapsApi,
      formData
    });

    // Show progress indicator
    setCalculationProgress({
      isVisible: true,
      current: 0,
      total: formData.travelDays || 1,
      currentSegment: `${formData.startLocation} → ${formData.endLocation}`,
      accuracy: hasGoogleMapsApi ? 'high' : 'estimated'
    });

    try {
      // Start the trip calculation
      await calculateTrip(formData);
      
      // Hide progress after completion
      setTimeout(() => {
        setCalculationProgress(prev => ({ ...prev, isVisible: false }));
      }, 1000);
      
    } catch (error) {
      console.error('❌ Enhanced trip calculation failed:', error);
      setCalculationProgress(prev => ({ ...prev, isVisible: false }));
    }
  }, [calculateTrip, hasGoogleMapsApi]);

  const handleResetTrip = useCallback(() => {
    resetTrip();
    setCalculationProgress({
      isVisible: false,
      current: 0,
      total: 0,
      currentSegment: '',
      accuracy: 'estimated'
    });
  }, [resetTrip]);

  return (
    <div className="space-y-6">
      {/* Google Maps API Configuration */}
      <GoogleMapsApiInput 
        onApiKeySet={handleApiKeySet}
        className="mb-4"
      />

      {/* Trip Calculation Progress */}
      <DistanceCalculationProgress {...calculationProgress} />

      {/* Trip Planning Form */}
      <Card className="vintage-paper-texture border-2 border-route66-vintage-brown">
        <CardHeader className="bg-gradient-to-r from-route66-orange to-route66-vintage-yellow text-white">
          <CardTitle className="font-route66 text-xl text-center flex items-center justify-center gap-2">
            🛣️ ROUTE 66 TRIP PLANNER
            {hasGoogleMapsApi && (
              <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                🗺️ Enhanced
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {!tripPlan ? (
              <>
                <TripCalculatorForm 
                  onCalculate={handleCalculateTrip} 
                  isCalculating={isCalculating}
                />
                
                {/* Accuracy Notice */}
                <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {hasGoogleMapsApi ? (
                    <p>✅ <strong>Enhanced Accuracy:</strong> Using Google Maps for precise distance and drive time calculations</p>
                  ) : (
                    <p>📊 <strong>Estimated Calculations:</strong> Connect Google Maps API above for enhanced accuracy</p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <Button 
                  onClick={handleResetTrip}
                  variant="outline"
                  className="font-travel"
                >
                  🔄 Plan Another Trip
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trip Results */}
      {tripPlan && planningResult && (
        <TripCalculatorResults 
          tripPlan={tripPlan}
          tripStartDate={planningResult.debugInfo?.tripStartDate}
          completionAnalysis={planningResult.completionAnalysis}
          originalRequestedDays={planningResult.originalRequestedDays}
        />
      )}
    </div>
  );
};

export default Route66TripCalculator;
