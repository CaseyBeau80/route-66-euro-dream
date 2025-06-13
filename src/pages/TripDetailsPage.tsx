
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import NavigationBar from '@/components/NavigationBar';
import { TripService, SavedTrip } from '@/components/TripCalculator/services/TripService';
import { toast } from '@/hooks/use-toast';
import TripDetailsHeader from './TripDetailsPage/components/TripDetailsHeader';
import TripDetailsLoading from './TripDetailsPage/components/TripDetailsLoading';
import TripDetailsError from './TripDetailsPage/components/TripDetailsError';
import TripDetailsContent from './TripDetailsPage/components/TripDetailsContent';
import TripDetailsErrorBoundary from './TripDetailsPage/components/TripDetailsErrorBoundary';

const TripDetailsPage: React.FC = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 TripDetailsPage: shareCode from URL params:', { shareCode });
    
    const loadTrip = async () => {
      // Validate shareCode exists and has correct format
      if (!shareCode) {
        console.error('❌ TripDetailsPage: No shareCode provided in URL');
        setError('Invalid share code - no code provided');
        setLoading(false);
        return;
      }

      if (shareCode.length !== 8) {
        console.error('❌ TripDetailsPage: Invalid shareCode format:', shareCode);
        setError('Invalid share code format - must be 8 characters');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 TripDetailsPage: Loading trip with share code:', shareCode);
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000)
        );
        
        const tripPromise = TripService.loadTripByShareCode(shareCode);
        const tripData = await Promise.race([tripPromise, timeoutPromise]);
        
        console.log('✅ TripDetailsPage: Trip loaded successfully:', tripData.title);
        
        // Validate trip data structure before setting state
        if (!tripData.trip_data) {
          throw new Error('Trip data is missing or corrupted');
        }
        
        setTrip(tripData);
        
        // Increment view count (don't await to avoid blocking)
        TripService.incrementViewCount(shareCode).catch(err => {
          console.warn('⚠️ Failed to increment view count:', err);
        });
        
      } catch (err) {
        console.error('❌ TripDetailsPage: Error loading trip:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load trip';
        setError(errorMessage);
        
        // Show user-friendly toast
        toast({
          title: "Trip Not Found",
          description: "The requested trip could not be found. It may have been removed or the link is invalid.",
          variant: "destructive"
        });
        
        // Redirect to trip calculator after a delay if trip not found
        if (errorMessage.includes('not found') || errorMessage.includes('timeout')) {
          setTimeout(() => {
            console.log('🔄 TripDetailsPage: Redirecting to trip calculator due to error');
            navigate('/trip-calculator');
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [shareCode, navigate]);

  const handleBackToHome = () => navigate('/');
  const handlePlanNewTrip = () => navigate('/trip-calculator');

  // Dynamic page title for shared trips
  const pageTitle = trip 
    ? `${trip.trip_data?.startCity} to ${trip.trip_data?.endCity} - RAMBLE 66`
    : 'RAMBLE 66 - Route 66 Trip Planner';

  if (loading) {
    return (
      <TripDetailsErrorBoundary>
        <Helmet>
          <title>Loading Trip - RAMBLE 66</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
          <NavigationBar language={language} setLanguage={setLanguage} />
          <TripDetailsLoading shareCode={shareCode} />
        </div>
      </TripDetailsErrorBoundary>
    );
  }

  if (error || !trip) {
    return (
      <TripDetailsErrorBoundary>
        <Helmet>
          <title>Trip Not Found - RAMBLE 66</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
          <NavigationBar language={language} setLanguage={setLanguage} />
          <TripDetailsError 
            error={error || 'Trip not found'}
            shareCode={shareCode}
            onBackToHome={handleBackToHome}
            onPlanNewTrip={handlePlanNewTrip}
          />
        </div>
      </TripDetailsErrorBoundary>
    );
  }

  const shareUrl = TripService.getShareUrl(shareCode!);

  return (
    <TripDetailsErrorBoundary>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Route 66 trip from ${trip.trip_data?.startCity} to ${trip.trip_data?.endCity} - Plan your perfect Route 66 adventure`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
        <NavigationBar language={language} setLanguage={setLanguage} />
        
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <TripDetailsHeader 
                trip={trip}
                onBackToHome={handleBackToHome}
                onPlanNewTrip={handlePlanNewTrip}
              />
              
              {/* Enhanced Trip Content with Error Boundary */}
              <TripDetailsContent 
                trip={trip}
                shareUrl={shareUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </TripDetailsErrorBoundary>
  );
};

export default TripDetailsPage;
