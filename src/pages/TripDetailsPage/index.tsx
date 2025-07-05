import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TripService, SavedTrip } from '@/components/TripCalculator/services/TripService';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import TripDetailsContent from './components/TripDetailsContent';
import TripDetailsLoading from './components/TripDetailsLoading';
import TripDetailsError from './components/TripDetailsError';

const TripDetailsPage: React.FC = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrip = async () => {
      if (!shareCode) {
        setError('No trip code provided');
        setLoading(false);
        return;
      }

      try {
        console.log('🔗 TripDetailsPage: Loading trip with share code:', shareCode);
        setLoading(true);
        setError(null);

        // Load trip from database
        const loadedTrip = await TripService.loadTripByShareCode(shareCode);
        
        // Increment view count
        await TripService.incrementViewCount(shareCode);

        setTrip(loadedTrip);
        console.log('✅ TripDetailsPage: Trip loaded successfully:', loadedTrip.title);
      } catch (err) {
        console.error('❌ TripDetailsPage: Error loading trip:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load trip';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [shareCode]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handlePlanNewTrip = () => {
    navigate('/#trip-calculator');
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Generate SEO metadata
  const getMetadata = () => {
    if (trip) {
      const title = `${trip.title} | Ramble Route 66`;
      const description = trip.description || `Explore this ${trip.trip_data?.totalDays || 'multi'}-day Route 66 adventure from ${trip.trip_data?.startCity || 'Chicago'} to ${trip.trip_data?.endCity || 'Santa Monica'}.`;
      return { title, description };
    }
    return {
      title: 'Route 66 Trip | Ramble Route 66',
      description: 'View a shared Route 66 trip itinerary with detailed stops, attractions, and travel information.'
    };
  };

  const { title, description } = getMetadata();

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Trip | Ramble Route 66</title>
          <meta name="description" content="Loading your Route 66 trip details..." />
        </Helmet>
        <NavigationBar language="en" setLanguage={() => {}} />
        <main className="min-h-screen bg-white">
          <TripDetailsLoading shareCode={shareCode} />
        </main>
        <Footer language="en" />
      </>
    );
  }

  if (error || !trip) {
    return (
      <>
        <Helmet>
          <title>Trip Not Found | Ramble Route 66</title>
          <meta name="description" content="The requested Route 66 trip could not be found." />
        </Helmet>
        <NavigationBar language="en" setLanguage={() => {}} />
        <main className="min-h-screen bg-white">
          <TripDetailsError
            error={error || 'Trip not found'}
            shareCode={shareCode}
            onBackToHome={handleBackToHome}
            onPlanNewTrip={handlePlanNewTrip}
          />
        </main>
        <Footer language="en" />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={trip.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={shareUrl} />
        <link rel="canonical" href={shareUrl} />
      </Helmet>
      
      <NavigationBar language="en" setLanguage={() => {}} />
      
      <main className="min-h-screen bg-gray-50">
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <TripDetailsContent
                trip={trip}
                shareUrl={shareUrl}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer language="en" />
    </>
  );
};

export default TripDetailsPage;