
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Users } from 'lucide-react';
import { TripPlan } from '@/components/TripCalculator/services/planning/TripPlanBuilder';
import { UrlTripPlanBuilder } from '@/components/TripCalculator/services/planning/UrlTripPlanBuilder';
import SharedTripContentRenderer from '@/components/TripCalculator/components/share/SharedTripContentRenderer';

const SharedTripPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripStartDate, setTripStartDate] = useState<Date | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    const buildTripFromUrl = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔗 SharedTripPage: Building trip from URL parameters');

        // Build trip plan from URL parameters
        const result = await UrlTripPlanBuilder.buildTripFromUrl(searchParams);

        if (result.success && result.tripPlan) {
          setTripPlan(result.tripPlan);
          setTripStartDate(result.tripStartDate);
          setShareUrl(window.location.href);

          console.log('✅ SharedTripPage: Trip plan built successfully:', {
            title: result.tripPlan.title,
            segments: result.tripPlan.segments.length,
            startDate: result.tripStartDate?.toISOString()
          });

          toast({
            title: "Trip Loaded Successfully",
            description: `Viewing ${result.tripPlan.segments.length}-day trip plan`,
            variant: "default"
          });
        } else {
          throw new Error(result.error || 'Failed to build trip from URL');
        }
      } catch (err) {
        console.error('❌ SharedTripPage: Error building trip:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load trip';
        setError(errorMessage);
        
        toast({
          title: "Failed to Load Trip",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    buildTripFromUrl();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Trip Plan</h2>
          <p className="text-gray-500">Building your Route 66 adventure...</p>
        </div>
      </div>
    );
  }

  if (error || !tripPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚗💨</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Trip Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'The trip you\'re looking for could not be loaded.'}</p>
          <Button onClick={() => navigate('/trip-calculator')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Plan a New Trip
          </Button>
        </div>
      </div>
    );
  }

  const getTripMetadata = () => {
    const segments = tripPlan.segments || [];
    const startCity = segments[0]?.startCity || tripPlan.startCity || 'Route 66';
    const endCity = segments[segments.length - 1]?.endCity || tripPlan.endCity || 'Destination';
    const days = tripPlan.totalDays || segments.length;
    
    return { startCity, endCity, days };
  };

  const { startCity, endCity, days } = getTripMetadata();

  return (
    <>
      <Helmet>
        <title>{tripPlan.title} | Route 66 Trip Planner</title>
        <meta name="description" content={`${days}-day Route 66 trip from ${startCity} to ${endCity}. Complete itinerary with daily destinations, weather forecasts, and attractions.`} />
        <meta property="og:title" content={tripPlan.title} />
        <meta property="og:description" content={`${days}-day Route 66 adventure from ${startCity} to ${endCity}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={shareUrl || ''} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/trip-calculator')}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Planner
                </Button>
                
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{startCity} → {endCity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{days} days</span>
                  </div>
                  {tripStartDate && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Starts {tripStartDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(shareUrl || '')}
                  className="hidden md:inline-flex"
                >
                  Share Trip
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <SharedTripContentRenderer
            tripPlan={tripPlan}
            tripStartDate={tripStartDate || undefined}
            shareUrl={shareUrl}
            isSharedView={true}
          />
        </div>
      </div>
    </>
  );
};

export default SharedTripPage;
