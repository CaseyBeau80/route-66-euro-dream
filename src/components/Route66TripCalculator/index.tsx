import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Route66TripForm from './components/Route66TripForm';
import TripCalculatorResults from '../TripCalculator/TripCalculatorResults';
import { Route66TripPlannerService, TripPlan } from '../TripCalculator/services/Route66TripPlannerService';
import { TripCompletionService, TripCompletionAnalysis } from '../TripCalculator/services/planning/TripCompletionService';
import { toast } from '@/hooks/use-toast';
import ShareTripModal from '../TripCalculator/components/ShareTripModal';

const Route66TripCalculator: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripStartDate, setTripStartDate] = useState<Date>(new Date());
  const [completionAnalysis, setCompletionAnalysis] = useState<TripCompletionAnalysis | null>(null);
  const [originalRequestedDays, setOriginalRequestedDays] = useState<number | undefined>();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Load trip from URL parameters on mount
  useEffect(() => {
    const startLocation = searchParams.get('startLocation');
    const endLocation = searchParams.get('endLocation');
    const travelDays = searchParams.get('travelDays');
    const tripStartParam = searchParams.get('tripStartDate');

    if (startLocation && endLocation && travelDays) {
      const days = parseInt(travelDays, 10);
      if (!isNaN(days)) {
        if (tripStartParam) {
          const startDate = new Date(tripStartParam);
          if (!isNaN(startDate.getTime())) {
            setTripStartDate(startDate);
          }
        }
        
        handleTripCalculation(startLocation, endLocation, days);
      }
    }
  }, [searchParams]);

  const handleTripCalculation = useCallback(async (
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ) => {
    setLoading(true);
    setError(null);
    setOriginalRequestedDays(travelDays);

    try {
      console.log('🚗 Route66TripCalculator: Planning trip with params:', {
        startLocation,
        endLocation,
        travelDays,
        tripStyle,
        tripStartDate: tripStartDate.toISOString()
      });

      const result = await Route66TripPlannerService.planTrip(
        startLocation,
        endLocation,
        travelDays,
        tripStyle
      );

      console.log('✅ Route66TripCalculator: Trip planned successfully:', {
        title: result.title,
        segments: result.segments.length,
        totalDistance: result.totalDistance
      });

      // Analyze trip completion
      const analysis = TripCompletionService.analyzeTripCompletion(result, travelDays);
      setCompletionAnalysis(analysis);

      setTripPlan(result);

      // Update URL parameters
      const newParams = new URLSearchParams(searchParams);
      newParams.set('startLocation', startLocation);
      newParams.set('endLocation', endLocation);
      newParams.set('travelDays', travelDays.toString());
      newParams.set('tripStartDate', tripStartDate.toISOString());
      setSearchParams(newParams, { replace: true });

      toast({
        title: "Trip Planned Successfully! 🎉",
        description: `Your ${travelDays}-day Route 66 adventure from ${startLocation} to ${endLocation} is ready!`,
        variant: "default"
      });

    } catch (err) {
      console.error('❌ Route66TripCalculator: Error planning trip:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to plan trip';
      setError(errorMessage);
      
      toast({
        title: "Planning Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [tripStartDate, searchParams, setSearchParams]);

  const handleShareTrip = useCallback(() => {
    if (tripPlan) {
      setIsShareModalOpen(true);
    } else {
      toast({
        title: "No Trip to Share",
        description: "Please create a trip plan first before sharing.",
        variant: "destructive"
      });
    }
  }, [tripPlan]);

  const handleShareUrlGenerated = useCallback((shareCode: string, generatedShareUrl: string) => {
    setShareUrl(generatedShareUrl);
    console.log('📤 Route66TripCalculator: Share URL generated:', {
      shareCode,
      shareUrl: generatedShareUrl
    });
  }, []);

  const handleDateRequired = useCallback(() => {
    // Handle date selection requirement
    console.log('📅 Date selection required');
  }, []);

  return (
    <div className="space-y-8">
      {/* Trip Planning Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-route66-primary">
            🛣️ Plan Your Route 66 Adventure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Route66TripForm
            onTripCalculation={handleTripCalculation}
            loading={loading}
            tripStartDate={tripStartDate}
            onTripStartDateChange={setTripStartDate}
            error={error}
            onClearError={() => setError(null)}
          />
        </CardContent>
      </Card>

      {/* FIXED: Use the correct TripCalculatorResults component with share modal */}
      <TripCalculatorResults
        tripPlan={tripPlan}
        shareUrl={shareUrl}
        tripStartDate={tripStartDate}
        completionAnalysis={completionAnalysis}
        originalRequestedDays={originalRequestedDays}
        onDateRequired={handleDateRequired}
        onShareUrlGenerated={handleShareUrlGenerated}
      />

      {/* Share Modal */}
      {tripPlan && (
        <ShareTripModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          shareUrl={shareUrl}
          onShareUrlGenerated={handleShareUrlGenerated}
        />
      )}
    </div>
  );
};

export default Route66TripCalculator;
