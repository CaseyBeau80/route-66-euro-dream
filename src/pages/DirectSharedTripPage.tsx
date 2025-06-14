
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PlanYourOwnTripCTA from '@/components/shared/PlanYourOwnTripCTA';
import DirectTripHeader from './DirectSharedTripPage/components/DirectTripHeader';
import DirectTripSegmentCard from './DirectSharedTripPage/components/DirectTripSegmentCard';
import DirectTripLoading from './DirectSharedTripPage/components/DirectTripLoading';
import DirectTripError from './DirectSharedTripPage/components/DirectTripError';
import DirectTripNavigation from './DirectSharedTripPage/components/DirectTripNavigation';

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
    return <DirectTripLoading />;
  }

  if (error || !tripData) {
    return <DirectTripError error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>{tripData.title} | Route 66 Trip</title>
        <meta name="description" content={`${tripData.totalDays}-day Route 66 trip from ${tripData.startCity} to ${tripData.endCity} with live weather forecasts.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <DirectTripNavigation
          startCity={tripData.startCity}
          endCity={tripData.endCity}
          totalDays={tripData.totalDays}
        />

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Trip Header */}
          <DirectTripHeader
            title={tripData.title}
            totalDays={tripData.totalDays}
            totalDistance={tripData.totalDistance}
            tripStartDate={tripData.tripStartDate}
          />

          {/* Daily Segments */}
          <div className="space-y-6 mb-8">
            {tripData.segments.map((segment) => (
              <DirectTripSegmentCard
                key={`day-${segment.day}`}
                segment={segment}
                tripStartDate={tripData.tripStartDate}
              />
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
