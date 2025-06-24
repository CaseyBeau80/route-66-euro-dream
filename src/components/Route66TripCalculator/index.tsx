import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Route66TripForm from './components/Route66TripForm';
import TripCalculatorResults from '../TripCalculator/TripCalculatorResults';
import GoogleMapsApiSection from './components/GoogleMapsApiSection';
import { Route66TripPlannerService, TripPlan } from '../TripCalculator/services/Route66TripPlannerService';
import { TripCompletionService, TripCompletionAnalysis } from '../TripCalculator/services/planning/TripCompletionService';
import { toast } from '@/hooks/use-toast';
import EnhancedShareTripModal from '../TripCalculator/components/share/EnhancedShareTripModal';

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
  const [hasGoogleMapsApi, setHasGoogleMapsApi] = useState(false);

  console.log('🔧 Route66TripCalculator: State debug', {
    hasTripPlan: !!tripPlan,
    isShareModalOpen,
    shareUrl,
    tripStartDate: tripStartDate.toISOString(),
    hasGoogleMapsApi
  });

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
        tripStartDate: tripStartDate.toISOString(),
        usingGoogleMaps: hasGoogleMapsApi
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
        totalDistance: result.totalDistance,
        segmentDistances: result.segments.map(s => ({ 
          day: s.day, 
          route: `${s.startCity} → ${s.endCity}`,
          distance: s.distance, 
          approximateMiles: s.approximateMiles,
          isGoogleData: s.isGoogleMapsData
        })),
        dataSource: Route66TripPlannerService.getDataSourceStatus()
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

      const dataSourceMsg = hasGoogleMapsApi ? 'using real Google Maps distances' : 'using estimated distances';
      toast({
        title: "Trip Planned Successfully! 🎉",
        description: `Your ${travelDays}-day Route 66 adventure from ${startLocation} to ${endLocation} is ready ${dataSourceMsg}!`,
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
  }, [tripStartDate, searchParams, setSearchParams, hasGoogleMapsApi]);

  // FIXED: Ensure this function properly opens the modal
  const handleShareTrip = useCallback(() => {
    console.log('📤 handleShareTrip called - OPENING SHARE MODAL');
    if (tripPlan) {
      setIsShareModalOpen(true);
      console.log('✅ Share modal should now be open, isShareModalOpen:', true);
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
    console.log('📅 Date selection required');
  }, []);

  return (
    <div className="space-y-8">
      {/* Google Maps API Section */}
      <GoogleMapsApiSection onApiKeyChange={setHasGoogleMapsApi} />

      {/* Trip Planning Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-route66-primary">
            🛣️ Plan Your Route 66 Adventure
          </CardTitle>
          <p className="text-center text-route66-text-secondary">
            {hasGoogleMapsApi ? 
              '🗺️ Using Google Maps for accurate driving distances' : 
              '📊 Using estimated distances - add Google Maps API for accuracy'
            }
          </p>
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

      {/* FIXED: Ensure onShareTrip is properly passed */}
      <TripCalculatorResults
        tripPlan={tripPlan}
        calculation={null}
        shareUrl={shareUrl}
        tripStartDate={tripStartDate}
        completionAnalysis={completionAnalysis}
        originalRequestedDays={originalRequestedDays}
        onShareTrip={handleShareTrip}
        onDateRequired={handleDateRequired}
      />

      {/* FIXED: Share Modal with proper state management */}
      {tripPlan && (
        <EnhancedShareTripModal
          isOpen={isShareModalOpen}
          onClose={() => {
            console.log('📤 Closing share modal');
            setIsShareModalOpen(false);
          }}
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          onShareUrlGenerated={handleShareUrlGenerated}
        />
      )}
    </div>
  );
};

export default Route66TripCalculator;
