
import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calculator, MapPin, Clock, DollarSign, Share2, Sparkles } from 'lucide-react';
import { TripFormData } from '../TripCalculator/types/tripCalculator';
import { TripPlan } from '../TripCalculator/services/planning/TripPlanBuilder';
import { TripCompletionAnalysis } from '../TripCalculator/services/planning/TripCompletionService';
import { useTripCalculation } from './hooks/useTripCalculation';
import { useCostEstimator } from '../TripCalculator/hooks/useCostEstimator';
import { toast } from '@/hooks/use-toast';
import TripPlannerForm from './components/TripPlannerForm';
import TripResults from './components/TripResults';
import TripLoadingDisplay from './components/TripLoadingDisplay';
import EnhancedShareTripModal from '../TripCalculator/components/share/EnhancedShareTripModal';
import CostCalculatorBanner from './components/CostCalculatorBanner';
import FloatingCostPrompt from './components/FloatingCostPrompt';

interface Route66TripCalculatorProps {
  // Define any props here
}

const Route66TripCalculator: React.FC = () => {
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 0, // FIXED: Changed from 7 to 0 to enforce dropdown selection
    dailyDrivingLimit: 300,
    tripStyle: 'destination-focused', // FIXED: Only destination-focused allowed
    tripStartDate: new Date()
  });

  const {
    tripPlan,
    isCalculating,
    planningResult,
    calculateTrip,
    resetTrip
  } = useTripCalculation();

  const {
    costEstimate,
    costData
  } = useCostEstimator(tripPlan);

  const [showShareModal, setShowShareModal] = useState(false);
  const [hasCostEstimate, setHasCostEstimate] = useState(false);
  const [completionAnalysis, setCompletionAnalysis] = useState<TripCompletionAnalysis | undefined>();
  const [originalRequestedDays, setOriginalRequestedDays] = useState<number | undefined>();

  useEffect(() => {
    console.log('✨ Route66TripCalculator: Component mounted');
    return () => {
      console.log('✨ Route66TripCalculator: Component unmounted');
    };
  }, []);

  // Track completion analysis from planning result
  useEffect(() => {
    if (planningResult && planningResult.originalRequestedDays !== undefined) {
      // Fix type casting for completion analysis
      const analysis = planningResult.completionAnalysis as TripCompletionAnalysis | undefined;
      setCompletionAnalysis(analysis);
      setOriginalRequestedDays(planningResult.originalRequestedDays);
      console.log('📊 Route66TripCalculator: Completion analysis updated:', {
        hasAnalysis: !!analysis,
        originalDays: planningResult.originalRequestedDays,
        finalDays: tripPlan?.totalDays
      });
    }
  }, [planningResult, tripPlan]);

  // Track if user has used the cost calculator
  useEffect(() => {
    setHasCostEstimate(!!costEstimate);
  }, [costEstimate]);

  const handlePlanTrip = useCallback(() => {
    console.log('🚀 Plan trip requested with data:', formData);
    if (!formData.startLocation || !formData.endLocation) {
      toast({
        title: "Missing Information",
        description: "Please select both a start and end location for your trip.",
        variant: "destructive"
      });
      return;
    }

    // FIXED: Add validation for travel days
    if (formData.travelDays === 0) {
      toast({
        title: "Missing Information",
        description: "Please select the number of travel days for your trip.",
        variant: "destructive"
      });
      return;
    }

    // Store the original requested days before calculation
    setOriginalRequestedDays(formData.travelDays);
    calculateTrip(formData);
  }, [formData, calculateTrip]);

  const handleResetTrip = useCallback(() => {
    console.log('🔄 Reset trip requested');
    resetTrip();
    setHasCostEstimate(false);
    setCompletionAnalysis(undefined);
    setOriginalRequestedDays(undefined);
    // FIXED: Reset travel days to 0 to force dropdown selection
    setFormData(prev => ({
      ...prev,
      travelDays: 0
    }));
  }, [resetTrip]);

  const handleShareTrip = useCallback(() => {
    console.log('📤 Route66TripCalculator: Share trip requested', {
      hasTripPlan: !!tripPlan,
      hasStartDate: !!formData.tripStartDate,
      segments: tripPlan?.segments?.length || 0
    });
    if (!tripPlan) {
      toast({
        title: "No Trip to Share",
        description: "Please create a trip plan first before sharing.",
        variant: "destructive"
      });
      return;
    }
    setShowShareModal(true);
  }, [tripPlan, formData.tripStartDate]);

  const handleStartDateChange = (date: Date | undefined) => {
    console.log('📅 Start date changed:', date);
    setFormData(prev => ({
      ...prev,
      tripStartDate: date
    }));
  };

  const handleLocationChange = (type: 'start' | 'end', location: string) => {
    console.log(`📍 ${type} location changed:`, location);
    setFormData(prev => ({
      ...prev,
      [`${type}Location`]: location
    }));
  };

  const handleTravelDaysChange = (days: number) => {
    console.log('🗓️ Travel days changed:', days);
    setFormData(prev => ({
      ...prev,
      travelDays: days
    }));
  };

  const handleTripStyleChange = (style: 'destination-focused') => {
    console.log('🎨 Trip style changed:', style);
    setFormData(prev => ({
      ...prev,
      tripStyle: style
    }));
  };

  const scrollToCostCalculator = () => {
    const costSection = document.getElementById('cost-estimator-section');
    if (costSection) {
      costSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      

      {/* Planning Form Section - Now includes cost calculator */}
      <section className="bg-white rounded-xl shadow-lg border border-route66-tan p-6">
        <TripPlannerForm 
          formData={formData}
          onStartDateChange={handleStartDateChange}
          onLocationChange={handleLocationChange}
          onTravelDaysChange={handleTravelDaysChange}
          onTripStyleChange={handleTripStyleChange}
          onPlanTrip={handlePlanTrip}
          onResetTrip={handleResetTrip}
          isPlanning={isCalculating}
          tripPlan={tripPlan}
        />
      </section>

      {/* Trip Results Section */}
      {(tripPlan || isCalculating) && (
        <section id="trip-results" className="bg-white rounded-xl shadow-lg border border-route66-tan overflow-hidden">
          {isCalculating && <TripLoadingDisplay formData={formData} />}

          {!isCalculating && tripPlan && (
            <>
              <TripResults 
                tripPlan={tripPlan}
                tripStartDate={formData.tripStartDate}
                completionAnalysis={completionAnalysis}
                originalRequestedDays={originalRequestedDays}
                onShareTrip={handleShareTrip}
              />
              
              {/* Cost Calculator Banner */}
              {!hasCostEstimate && <CostCalculatorBanner onScrollToCalculator={scrollToCostCalculator} />}
            </>
          )}
        </section>
      )}

      {/* Floating Cost Prompt */}
      {tripPlan && !isCalculating && !hasCostEstimate && (
        <FloatingCostPrompt onScrollToCalculator={scrollToCostCalculator} />
      )}

      {/* Enhanced Share Modal */}
      {showShareModal && tripPlan && (
        <EnhancedShareTripModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          tripPlan={tripPlan}
          tripStartDate={formData.tripStartDate}
          onShareUrlGenerated={(shareCode, shareUrl) => {
            console.log('✅ Share URL generated:', {
              shareCode,
              shareUrl
            });
          }}
        />
      )}
    </div>
  );
};

export default Route66TripCalculator;
