import React, { useState, useEffect } from 'react';
import { route66Towns } from '@/types/route66';
import { TripFormData } from './TripCalculator/types/tripCalculator';
import { UnifiedTripPlanningService, UnifiedPlanningResult } from './TripCalculator/services/planning/UnifiedTripPlanningService';
import { TripService } from './TripCalculator/services/TripService';
import { TripPlan } from './TripCalculator/services/planning/TripPlanBuilder';
import TripCalculatorForm from './TripCalculator/TripCalculatorForm';
import EnhancedTripResults from './TripCalculator/EnhancedTripResults';
import { toast } from '@/hooks/use-toast';

const Route66TripCalculator: React.FC = () => {
  // Initialize with default trip style
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 7,
    dailyDrivingLimit: 6,
    tripStartDate: undefined,
    tripStyle: 'balanced' // Default to balanced
  });

  const [tripPlan, setTripPlan] = useState<TripPlan | undefined>();
  const [isCalculating, setIsCalculating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [planningResult, setPlanningResult] = useState<UnifiedPlanningResult | undefined>();

  useEffect(() => {
    // Load saved trip data from local storage on component mount
    const savedFormData = localStorage.getItem('tripFormData');
    if (savedFormData) {
      try {
        const parsedFormData = JSON.parse(savedFormData) as TripFormData;
        setFormData(parsedFormData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save form data to local storage whenever it changes
    localStorage.setItem('tripFormData', JSON.stringify(formData));
  }, [formData]);

  const getAvailableEndLocations = () => {
    // Filter out the selected start location from the available end locations
    return route66Towns.filter(town => town !== formData.startLocation);
  };

  const handleShareTrip = async (tripPlan: TripPlan) => {
    setIsCalculating(true);
    try {
      const shareCode = await TripService.saveTrip(tripPlan);
      if (shareCode) {
        const newShareUrl = TripService.getShareUrl(shareCode);
        setShareUrl(newShareUrl);
        toast({
          title: "Trip Saved & Shared!",
          description: "Your Route 66 trip has been saved and a shareable link has been generated.",
        });
      } else {
        toast({
          title: "Failed to Share",
          description: "Could not save trip. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sharing trip:', error);
      toast({
        title: "Sharing Error",
        description: "An error occurred while sharing the trip.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCalculateTrip = async () => {
    if (!formData.startLocation || !formData.endLocation) {
      console.error('❌ Missing required form data');
      return;
    }

    setIsCalculating(true);
    setTripPlan(undefined);
    setShareUrl(null);
    setPlanningResult(undefined);

    try {
      console.log('🚗 Starting trip calculation with style:', formData.tripStyle);

      const result = await UnifiedTripPlanningService.createTripPlan(
        formData.startLocation,
        formData.endLocation,
        route66Towns,
        formData.travelDays,
        formData.startLocation,
        formData.endLocation,
        formData.tripStyle
      );

      setPlanningResult(result);
      setTripPlan(result.tripPlan);

      // Show warnings if any
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          toast({
            title: "Planning Notice",
            description: warning,
            variant: "default"
          });
        });
      }

      // Show route assessment for destination-focused trips
      if (result.routeAssessment && !result.routeAssessment.isRecommended) {
        toast({
          title: "Route Assessment",
          description: result.routeAssessment.summary,
          variant: "destructive"
        });
      }

      console.log('✅ Trip calculation completed successfully');
    } catch (error) {
      console.error('❌ Trip calculation failed:', error);
      toast({
        title: "Planning Failed",
        description: "Could not create your trip plan. Please try different settings.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const availableEndLocations = getAvailableEndLocations();
  const isCalculateDisabled = !formData.startLocation || !formData.endLocation || formData.travelDays < 1;

  return (
    <div className="space-y-8">
      {/* Trip Calculator Form */}
      <TripCalculatorForm
        formData={formData}
        setFormData={setFormData}
        onCalculate={handleCalculateTrip}
        availableEndLocations={availableEndLocations}
        isCalculateDisabled={isCalculateDisabled}
        isCalculating={isCalculating}
        tripPlan={tripPlan}
        shareUrl={shareUrl}
      />

      {/* Trip Results */}
      {tripPlan && (
        <div className="mt-8">
          {/* Trip Style Indicator */}
          {planningResult && (
            <div className="mb-4 p-3 bg-route66-background-alt rounded-lg border border-route66-border">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-route66-text-primary">
                    Trip Style: {UnifiedTripPlanningService.getTripStyleDisplayName(planningResult.tripStyle)}
                  </span>
                  <p className="text-xs text-route66-text-secondary mt-1">
                    {UnifiedTripPlanningService.getTripStyleDescription(planningResult.tripStyle)}
                  </p>
                </div>
                {planningResult.tripStyle === 'destination-focused' && planningResult.routeAssessment && (
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      planningResult.routeAssessment.isRecommended 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {planningResult.routeAssessment.isRecommended ? 'Recommended' : 'Challenging'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <EnhancedTripResults 
            tripPlan={tripPlan} 
            shareUrl={shareUrl}
            tripStartDate={formData.tripStartDate}
          />
        </div>
      )}
    </div>
  );
};

export default Route66TripCalculator;
