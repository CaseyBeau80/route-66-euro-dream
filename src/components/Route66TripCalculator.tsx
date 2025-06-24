
import React, { useState, useEffect, useCallback } from 'react';
import { route66Towns } from '@/types/route66';
import { TripFormData } from './TripCalculator/types/tripCalculator';
import { TripPlan } from './TripCalculator/services/planning/TripPlanBuilder';
import { BasicTripPlanner } from './TripCalculator/services/planning/BasicTripPlanner';
import TripPlanDisplay from './TripCalculator/TripPlanDisplay';
import CompactTripPlannerForm from './TripCalculator/CompactTripPlannerForm';
import TripCalculatorForm from './TripCalculator/TripCalculatorForm';
import { useTripSharing } from './TripCalculator/hooks/useTripSharing';
import { toast } from "@/components/ui/use-toast";

const Route66TripCalculator: React.FC = () => {
  // State management
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 0,
    dailyDrivingLimit: 300,
    tripStyle: 'destination-focused',
    tripStartDate: new Date()
  });

  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [availableEndLocations, setAvailableEndLocations] = useState(route66Towns);
  const [isCompactMode, setIsCompactMode] = useState(false);

  // Trip sharing functionality
  const { shareUrl, generateShareUrl } = useTripSharing();

  // Detect if we're in split-screen mode (compact mode)
  useEffect(() => {
    const checkScreenMode = () => {
      // Check if we're on the trip calculator page and have sufficient screen width
      const isOnTripCalculatorPage = window.location.pathname === '/trip-calculator';
      const hasWideScreen = window.innerWidth >= 1024; // lg breakpoint
      setIsCompactMode(isOnTripCalculatorPage && hasWideScreen);
    };

    checkScreenMode();
    window.addEventListener('resize', checkScreenMode);
    return () => window.removeEventListener('resize', checkScreenMode);
  }, []);

  // Filter available end locations based on start location
  useEffect(() => {
    if (formData.startLocation === 'Chicago, IL') {
      setAvailableEndLocations(route66Towns.filter(town => 
        town.name !== 'Chicago, IL' && town.name.includes('Santa Monica, CA')
      ));
    } else if (formData.startLocation === 'Santa Monica, CA') {
      setAvailableEndLocations(route66Towns.filter(town => 
        town.name !== 'Santa Monica, CA' && town.name.includes('Chicago, IL')
      ));
    } else {
      setAvailableEndLocations(route66Towns);
    }
  }, [formData.startLocation]);

  // Form validation
  const isFormValid = formData.startLocation && formData.endLocation && formData.travelDays > 0;
  const isCalculateDisabled = !isFormValid || isCalculating;

  // Trip calculation handler
  const handleCalculate = useCallback(async () => {
    if (!isFormValid) return;

    console.log('🚗 Starting trip calculation with:', formData);
    setIsCalculating(true);

    try {
      const calculatedPlan = await BasicTripPlanner.planBasicTrip(
        formData.startLocation,
        formData.endLocation,
        formData.travelDays,
        formData.tripStyle
      );

      setTripPlan(calculatedPlan);
      
      // Generate share URL
      if (calculatedPlan) {
        await generateShareUrl(calculatedPlan);
      }

      toast({
        title: "Trip Planned Successfully! 🚗",
        description: `Your ${formData.travelDays}-day Route 66 adventure is ready!`,
        duration: 5000,
      });

      console.log('✅ Trip calculation completed:', calculatedPlan);
    } catch (error) {
      console.error('❌ Trip calculation failed:', error);
      toast({
        title: "Planning Error",
        description: "Unable to plan your trip. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsCalculating(false);
    }
  }, [formData, isFormValid, generateShareUrl]);

  console.log('🎯 Route66TripCalculator render:', {
    isCompactMode,
    hasTrip: !!tripPlan,
    isCalculating,
    formValid: isFormValid
  });

  return (
    <div className="w-full">
      {/* Trip Planning Form */}
      {isCompactMode ? (
        <CompactTripPlannerForm
          formData={formData}
          setFormData={setFormData}
          onCalculate={handleCalculate}
          availableEndLocations={availableEndLocations}
          isCalculateDisabled={isCalculateDisabled}
          isCalculating={isCalculating}
          tripPlan={tripPlan}
        />
      ) : (
        <TripCalculatorForm
          formData={formData}
          setFormData={setFormData}
          onCalculate={handleCalculate}
          availableEndLocations={availableEndLocations}
          isCalculateDisabled={isCalculateDisabled}
          isCalculating={isCalculating}
          tripPlan={tripPlan}
          shareUrl={shareUrl}
          onTripStyleChange={(style) => setFormData(prev => ({ ...prev, tripStyle: style }))}
        />
      )}

      {/* Trip Plan Display - Only show in compact mode if there's a trip */}
      {tripPlan && (
        <div className="mt-6">
          <TripPlanDisplay 
            tripPlan={tripPlan}
            shareUrl={shareUrl}
            isCompact={isCompactMode}
          />
        </div>
      )}
    </div>
  );
};

export default Route66TripCalculator;
