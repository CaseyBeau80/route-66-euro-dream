import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calculator, MapPin, Clock, DollarSign, Share2, Sparkles } from 'lucide-react';
import { TripFormData } from '../TripCalculator/types/tripCalculator';
import { TripPlan } from '../TripCalculator/services/planning/TripPlanBuilder';
import { useTripCalculation } from './hooks/useTripCalculation';
import { useCostEstimator } from '../TripCalculator/hooks/useCostEstimator';
import { toast } from '@/hooks/use-toast';
import TripPlannerForm from './components/TripPlannerForm';
import TripResults from './components/TripResults';
import TripLoadingDisplay from './components/TripLoadingDisplay';
import CostEstimatorSection from '../TripCalculator/components/CostEstimatorSection';
import EnhancedShareTripModal from '../TripCalculator/components/share/EnhancedShareTripModal';

interface Route66TripCalculatorProps {
  // Define any props here
}

const Route66TripCalculator: React.FC = () => {
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 7,
    tripStyle: 'balanced',
    tripStartDate: new Date()
  });
  const { tripPlan, isCalculating, planningResult, calculateTrip, resetTrip } = useTripCalculation();
  const { costEstimate } = useCostEstimator(tripPlan);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    console.log('✨ Route66TripCalculator: Component mounted');
    return () => {
      console.log('✨ Route66TripCalculator: Component unmounted');
    };
  }, []);

  const handlePlanTrip = useCallback(() => {
    console.log('🚀 Plan trip requested with data:', formData);
    if (!formData.startLocation || !formData.endLocation) {
      toast({
        title: "Missing Information",
        description: "Please select both a start and end location for your trip.",
        variant: "destructive",
      });
      return;
    }
    calculateTrip(formData);
  }, [formData, calculateTrip]);

  const handleResetTrip = useCallback(() => {
    console.log('🔄 Reset trip requested');
    resetTrip();
  }, [resetTrip]);

  const handleShareTrip = useCallback(() => {
    console.log('📤 Share trip requested', {
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
    setFormData(prev => ({ ...prev, tripStartDate: date }));
  };

  const handleLocationChange = (type: 'start' | 'end', location: string) => {
    console.log(`📍 ${type} location changed:`, location);
    setFormData(prev => ({ ...prev, [`${type}Location`]: location }));
  };

  const handleTravelDaysChange = (days: number) => {
    console.log('🗓️ Travel days changed:', days);
    setFormData(prev => ({ ...prev, travelDays: days }));
  };

  const handleTripStyleChange = (style: 'balanced' | 'destination-focused') => {
    console.log('🎨 Trip style changed:', style);
    setFormData(prev => ({ ...prev, tripStyle: style }));
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="text-center py-12">
        <h1 className="text-3xl font-bold text-route66-navy mb-4">
          Plan Your Route 66 Adventure
        </h1>
        <p className="text-lg text-route66-gray max-w-3xl mx-auto">
          Customize your Route 66 trip with our easy-to-use planner. Enter your start and end locations,
          choose your travel style, and let us create the perfect itinerary for you.
        </p>
      </section>

      {/* Planning Form Section */}
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
        />
      </section>

      {/* Trip Results Section */}
      {(tripPlan || isCalculating) && (
        <section id="trip-results" className="bg-white rounded-xl shadow-lg border border-route66-tan overflow-hidden">
          {isCalculating && (
            <TripLoadingDisplay formData={formData} />
          )}

          {!isCalculating && tripPlan && (
            <TripResults
              tripPlan={tripPlan}
              tripStartDate={formData.tripStartDate}
            />
          )}
        </section>
      )}

      {/* Enhanced Share Modal */}
      {showShareModal && tripPlan && (
        <EnhancedShareTripModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          tripPlan={tripPlan}
          tripStartDate={formData.tripStartDate}
          onShareUrlGenerated={(shareCode, shareUrl) => {
            console.log('✅ Share URL generated:', { shareCode, shareUrl });
            // Optionally update state or perform additional actions
          }}
        />
      )}
    </div>
  );
};

export default Route66TripCalculator;
