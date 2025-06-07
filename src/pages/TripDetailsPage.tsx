import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavigationBar from '@/components/NavigationBar';
import EnhancedTripResults from '@/components/TripCalculator/EnhancedTripResults';
import { TripService, SavedTrip } from '@/components/TripCalculator/services/TripService';
import { toast } from '@/hooks/use-toast';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
        <NavigationBar language={language} setLanguage={setLanguage} />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-route66-primary mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-route66-text-primary mb-2">Loading Trip...</h2>
              <p className="text-route66-text-secondary">Please wait while we fetch your Route 66 adventure.</p>
              {shareCode && (
                <p className="text-sm text-route66-text-muted mt-2">Trip ID: {shareCode}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
        <NavigationBar language={language} setLanguage={setLanguage} />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-route66-background rounded-xl shadow-lg border border-route66-border p-8">
                <h2 className="text-3xl font-bold text-route66-text-primary mb-4">Trip Not Found</h2>
                <p className="text-route66-text-secondary mb-6">
                  {error || 'The requested trip could not be found. It may have been removed or the link is invalid.'}
                </p>
                {shareCode && (
                  <p className="text-sm text-route66-text-muted mb-4">Requested Trip ID: {shareCode}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/trip-calculator')}
                    className="bg-route66-primary hover:bg-route66-rust text-white font-bold py-3 px-6 rounded-lg"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Plan a New Trip
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white font-bold py-3 px-6 rounded-lg"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-26 bg-route66-background rounded-lg border-2 border-route66-primary shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-1 border border-route66-border rounded-md"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                      <div className="text-route66-text-muted text-xs font-semibold tracking-wider">ROUTE</div>
                      <div className="text-route66-primary text-2xl font-black leading-none">66</div>
                      <div className="text-route66-text-muted text-[8px] font-medium">SHARED TRIP</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-route66-primary/20 opacity-20 blur-lg animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-route66-text-primary mb-4">
                {trip.title}
              </h1>
              
              {trip.description && (
                <p className="text-lg text-route66-text-secondary max-w-2xl mx-auto leading-relaxed mb-4">
                  {trip.description}
                </p>
              )}

              {/* Trip Stats */}
              <div className="flex justify-center items-center gap-6 mb-6 text-sm text-route66-text-secondary">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(trip.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{trip.view_count} views</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <Button
                  onClick={() => navigate('/trip-calculator')}
                  className="bg-route66-primary hover:bg-route66-rust text-white"
                >
                  Plan Your Own Trip
                </Button>
              </div>
            </div>
            
            {/* Trip Results - Note: shared trips don't have a start date set */}
            <div className="bg-route66-background rounded-xl shadow-lg border border-route66-border p-6">
              <EnhancedTripResults 
                tripPlan={trip.trip_data} 
                shareUrl={shareUrl}
                tripStartDate={undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;
