import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, CloudSun, AlertTriangle } from 'lucide-react';
import { TripPlan } from '@/components/TripCalculator/services/planning/TripPlanBuilder';
import { TripDataSerializer, SerializedTripData } from '@/components/TripCalculator/services/TripDataSerializer';
import SerializedTripContent from './SerializedTripPage/SerializedTripContent';

const SerializedTripPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState<SerializedTripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSerializedTrip = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 SerializedTripPage: Loading serialized trip data...');

        const serializedData = searchParams.get('data');
        if (!serializedData) {
          throw new Error('No trip data found in URL');
        }

        console.log('🔄 Raw serialized data length:', serializedData.length);

        const tripData = TripDataSerializer.deserializeTripData(serializedData);
        setTripData(tripData);

        const weatherCount = Object.keys(tripData.weatherData).length;
        
        console.log('✅ SerializedTripPage: Trip data loaded successfully', {
          segments: tripData.tripPlan.segments?.length,
          weatherEntries: weatherCount,
          serializedAt: tripData.serializedAt
        });

        toast({
          title: "Trip Loaded Successfully",
          description: weatherCount > 0 
            ? `Viewing trip with ${weatherCount} weather forecasts`
            : "Trip loaded (no weather data included)",
          variant: "default"
        });

      } catch (err) {
        console.error('❌ SerializedTripPage: Error loading trip:', err);
        let errorMessage = 'Failed to load trip';
        
        if (err instanceof Error) {
          if (err.message.includes('decompress') || err.message.includes('JSON')) {
            errorMessage = 'The trip link appears to be corrupted or invalid';
          } else if (err.message.includes('No trip data')) {
            errorMessage = 'No trip data found in the link';
          } else {
            errorMessage = err.message;
          }
        }
        
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

    loadSerializedTrip();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Trip with Weather Data</h2>
          <p className="text-gray-500">Preparing your Route 66 adventure...</p>
        </div>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">
            <AlertTriangle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Trip Link Error</h2>
          <p className="text-gray-500 mb-4">{error || 'Could not load trip data'}</p>
          <p className="text-sm text-gray-400 mb-6">
            This may happen if the trip link is too long or corrupted. Try generating a new link with fewer days or simplified trip data.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/trip-calculator')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Plan a New Trip
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              Try Reloading
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getTripMetadata = () => {
    const segments = tripData.tripPlan.segments || [];
    const startCity = segments[0]?.startCity || tripData.tripPlan.startCity || 'Route 66';
    const endCity = segments[segments.length - 1]?.endCity || tripData.tripPlan.endCity || 'Destination';
    const days = tripData.tripPlan.totalDays || segments.length;
    
    return { startCity, endCity, days };
  };

  const { startCity, endCity, days } = getTripMetadata();
  const shareUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>{tripData.tripPlan.title} | Route 66 Trip with Weather</title>
        <meta name="description" content={`${days}-day Route 66 trip from ${startCity} to ${endCity} with live weather forecasts included.`} />
        <meta property="og:title" content={tripData.tripPlan.title} />
        <meta property="og:description" content={`${days}-day Route 66 adventure from ${startCity} to ${endCity} with weather data`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={shareUrl} />
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
                  <div className="flex items-center gap-1">
                    <CloudSun className="w-4 h-4" />
                    <span>{Object.keys(tripData.weatherData).length} weather forecasts</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
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
          <SerializedTripContent
            tripData={tripData}
            shareUrl={shareUrl}
          />
        </div>
      </div>
    </>
  );
};

export default SerializedTripPage;
