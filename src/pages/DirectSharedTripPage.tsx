
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import UnifiedWeatherWidget from '@/components/TripCalculator/components/weather/UnifiedWeatherWidget';
import PlanYourOwnTripCTA from '@/components/shared/PlanYourOwnTripCTA';

interface DirectTripSegment {
  day: number;
  startCity: string;
  endCity: string;
  distance: number;
  drivingTime: number;
}

interface DirectTripData {
  title: string;
  startCity: string;
  endCity: string;
  totalDays: number;
  totalDistance: number;
  tripStartDate?: Date;
  segments: DirectTripSegment[];
}

const DirectSharedTripPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState<DirectTripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      
      console.log('🌟 NEW: DirectSharedTripPage loading with fresh approach');

      const title = searchParams.get('title');
      const startCity = searchParams.get('startCity');
      const endCity = searchParams.get('endCity');
      const totalDays = searchParams.get('totalDays');
      const totalDistance = searchParams.get('totalDistance');
      const tripStartDateParam = searchParams.get('tripStartDate');
      const segmentsParam = searchParams.get('segments');

      if (!title || !startCity || !endCity || !totalDays || !segmentsParam) {
        throw new Error('Missing required trip data in URL');
      }

      const segments = JSON.parse(segmentsParam) as DirectTripSegment[];
      
      const tripStartDate = tripStartDateParam ? new Date(tripStartDateParam) : undefined;

      const parsedTripData: DirectTripData = {
        title,
        startCity,
        endCity,
        totalDays: parseInt(totalDays),
        totalDistance: parseFloat(totalDistance || '0'),
        tripStartDate,
        segments
      };

      setTripData(parsedTripData);
      
      console.log('✅ NEW: Direct trip data loaded successfully:', {
        title: parsedTripData.title,
        segments: parsedTripData.segments.length,
        hasStartDate: !!parsedTripData.tripStartDate
      });

    } catch (err) {
      console.error('❌ NEW: Error parsing direct trip data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load trip');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Your Route 66 Trip</h2>
          <p className="text-gray-500">Preparing live weather forecasts...</p>
        </div>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚗💨</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Trip Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'Invalid trip data'}</p>
          <Button onClick={() => navigate('/trip-calculator')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Plan a New Trip
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{tripData.title} | Route 66 Trip</title>
        <meta name="description" content={`${tripData.totalDays}-day Route 66 trip from ${tripData.startCity} to ${tripData.endCity} with live weather forecasts.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/trip-calculator')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Plan Your Own Trip
              </Button>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{tripData.startCity} → {tripData.endCity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{tripData.totalDays} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Trip Header */}
          <div className="text-center mb-8 p-6 bg-white rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{tripData.title}</h1>
            <p className="text-gray-600 mb-4">
              {tripData.totalDays}-day Route 66 adventure • {Math.round(tripData.totalDistance)} miles
            </p>
            {tripData.tripStartDate && (
              <p className="text-sm text-gray-500">
                Starting {format(tripData.tripStartDate, 'EEEE, MMMM d, yyyy')}
              </p>
            )}
          </div>

          {/* Daily Segments */}
          <div className="space-y-6 mb-8">
            {tripData.segments.map((segment) => (
              <div key={`day-${segment.day}`} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Day Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">Day {segment.day}</h3>
                      <p className="text-green-100">
                        {tripData.tripStartDate && (
                          format(new Date(tripData.tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000), 'EEEE, MMMM d')
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{segment.endCity}</p>
                      <p className="text-green-100 text-sm">Destination</p>
                    </div>
                  </div>
                </div>

                {/* Day Content */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-green-600">
                        🗺️ {Math.round(segment.distance)}
                      </div>
                      <div className="text-xs text-gray-600">Miles</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-purple-600">
                        ⏱️ {segment.drivingTime}h
                      </div>
                      <div className="text-xs text-gray-600">Drive Time</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-sm font-medium text-gray-700">
                        🚗 {segment.startCity} → {segment.endCity}
                      </div>
                      <div className="text-xs text-gray-600">Route</div>
                    </div>
                  </div>

                  {/* Weather - Using the unified system with fresh data */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      🌤️ Live Weather Forecast for {segment.endCity}
                    </h4>
                    <UnifiedWeatherWidget
                      segment={{
                        day: segment.day,
                        startCity: segment.startCity,
                        endCity: segment.endCity,
                        distance: segment.distance,
                        drivingTime: segment.drivingTime
                      }}
                      tripStartDate={tripData.tripStartDate}
                      isSharedView={true}
                      isPDFExport={false}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <PlanYourOwnTripCTA 
            variant="full" 
            currentPath="/direct-trip"
            className="mt-8"
          />
        </div>
      </div>
    </>
  );
};

export default DirectSharedTripPage;
