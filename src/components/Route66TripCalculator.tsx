
import React, { useState, useEffect } from 'react';
import { route66Towns } from '@/types/route66';
import { TripFormData } from './TripCalculator/types/tripCalculator';
import { UnifiedTripPlanningService, TripPlanningResult } from './TripCalculator/services/planning/UnifiedTripPlanningService';
import { TripService } from './TripCalculator/services/TripService';
import { TripPlan } from './TripCalculator/services/planning/TripPlanBuilder';
import { TripStop } from './TripCalculator/types/TripStop';
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
  const [planningResult, setPlanningResult] = useState<TripPlanningResult | undefined>();

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
    return route66Towns.filter(town => town.name !== formData.startLocation);
  };

  // Convert Route66Town to TripStop
  const convertRoute66TownToTripStop = (town: typeof route66Towns[0]): TripStop => {
    const [latitude, longitude] = town.latLng;
    const parts = town.name.split(', ');
    const cityName = parts[0];
    const state = parts[1] || '';
    
    return {
      id: `route66-${town.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
      name: town.name,
      description: `Historic Route 66 stop in ${town.name}`,
      category: 'destination_city',
      city_name: cityName,
      city: cityName,
      state: state,
      latitude: latitude,
      longitude: longitude,
      is_major_stop: true,
      is_official_destination: true
    };
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

      // Find the actual Route66Town objects from route66Towns
      const startTown = route66Towns.find(town => town.name === formData.startLocation);
      const endTown = route66Towns.find(town => town.name === formData.endLocation);

      if (!startTown || !endTown) {
        throw new Error('Could not find start or end location in Route 66 towns data');
      }

      // Convert Route66Town objects to TripStop objects
      const startStop = convertRoute66TownToTripStop(startTown);
      const endStop = convertRoute66TownToTripStop(endTown);
      
      // Convert all route66Towns to TripStop objects for the planning service
      const allStops = route66Towns.map(convertRoute66TownToTripStop);

      const result = await UnifiedTripPlanningService.createTripPlan(
        startStop,
        endStop,
        allStops,
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

  const getTripStyleDisplayName = (style: string) => {
    switch (style) {
      case 'balanced': return 'Balanced Experience';
      case 'destination-focused': return 'Destination Focused';
      default: return 'Custom Trip';
    }
  };

  const getTripStyleDescription = (style: string) => {
    switch (style) {
      case 'balanced': return 'Perfect mix of driving time and sightseeing at each stop';
      case 'destination-focused': return 'Prioritizes major heritage cities with strategic stops';
      default: return 'Customized to your preferences';
    }
  };

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
          {/* Enhanced Trip Style Indicator */}
          {planningResult && (
            <div className="mb-4 p-4 bg-route66-background-alt rounded-lg border border-route66-border">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-medium text-route66-text-primary">
                    Trip Style: {getTripStyleDisplayName(planningResult.tripStyle)}
                  </span>
                  <p className="text-xs text-route66-text-secondary mt-1">
                    {getTripStyleDescription(planningResult.tripStyle)}
                  </p>
                </div>
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
