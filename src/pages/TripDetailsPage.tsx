
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import { TripService, SavedTrip } from '@/components/TripCalculator/services/TripService';
import { toast } from '@/hooks/use-toast';
import TripDetailsHeader from './TripDetailsPage/components/TripDetailsHeader';
import TripDetailsLoading from './TripDetailsPage/components/TripDetailsLoading';
import TripDetailsError from './TripDetailsPage/components/TripDetailsError';
import TripDetailsContent from './TripDetailsPage/components/TripDetailsContent';

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
        const tripData = await TripService.loadTripByShareCode(shareCode);
        console.log('✅ TripDetailsPage: Trip loaded successfully:', tripData.title);
        setTrip(tripData);
        
        // Increment view count
        await TripService.incrementViewCount(shareCode);
        
        // Update the trip object to reflect the incremented view count
        setTrip(prev => prev ? { ...prev, view_count: prev.view_count + 1 } : null);
        
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
        if (errorMessage.includes('not found')) {
          setTimeout(() => {
            console.log('🔄 TripDetailsPage: Redirecting to trip calculator due to trip not found');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
        <NavigationBar language={language} setLanguage={setLanguage} />
        <TripDetailsLoading shareCode={shareCode} />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
        <NavigationBar language={language} setLanguage={setLanguage} />
        <TripDetailsError 
          error={error || 'Trip not found'}
          shareCode={shareCode}
          onBackToHome={handleBackToHome}
          onPlanNewTrip={handlePlanNewTrip}
        />
      </div>
    );
  }

  const shareUrl = TripService.getShareUrl(shareCode!);

  return (
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
            
            {/* Enhanced Trip Content - Now using PDF-style layout */}
            <TripDetailsContent 
              trip={trip}
              shareUrl={shareUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;
